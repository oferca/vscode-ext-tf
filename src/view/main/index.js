const fs = require('fs');
const vscode = require('vscode');
const { html } = require("./html");
const { getActions } = require('../../shared/actions');
const { changeFolderKey, credentialsKey, selectedProjectJsonKey } = require("../../shared/constants");
const { getProjectsCache } = require("../../shared/methods");
const { handleCommand, createCB } = require('./messages');

let tfProjectsCache = null;

(async () => { tfProjectsCache = await getProjectsCache(tfProjectsCache) })()

class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    async render(completed = false, tfCommand){
      // Parameter definitions
      const { fileHandler, shellHandler } = this.commandsLauncher.handler || {}
      const outputFileExists = this.commandsLauncher.handler && fileHandler && fileHandler.initialized
      const folder = this.stateManager.getState(changeFolderKey)
      const credentials = this.stateManager.getState(credentialsKey)
      let planSucceded = (tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1); // planSuccessful(this.outputFileContent)
      const preferences = {
        folder,
        credentials,
        showWarning: folder || credentials
      }
      
      // Update output
      this.outputFileContent = outputFileExists ? fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding) : undefined

      // Render
      const params = [
        preferences,
        getActions(this.stateManager),
        Math.random(),
        planSucceded,
        tfCommand,
        completed,
        this.commandLaunched,
      ]
      if (this.sideBarWebView) this.sideBarWebView.html = html(...params)
     
      tfProjectsCache = await getProjectsCache(tfProjectsCache)
      
      tfProjectsCache.forEach(project => {
        project.credentials = this.stateManager.getState(credentialsKey + "_" + project.name) || ""
      })
      const paramsExplorer = [...params]

      const selectedProjectState = (this.stateManager.getState(selectedProjectJsonKey) || "")
        .replaceAll("\"", "'")

      paramsExplorer.push(
        tfProjectsCache,
        selectedProjectState,
        this.withAnimation,
        this.context
      )

      if (!this.projectExplorer) return
      this.projectExplorer.html = html(...paramsExplorer)
      this.withAnimation = false
      
    }

    handlePreferences(message) {
      const oldPreferences = {
        userFolder: this.stateManager.getUserFolder(),
        credentials: this.stateManager.getState(credentialsKey)
      }
      const currentProjectOpt1 = JSON.parse(message.CURRENT_PROJECT ? message.CURRENT_PROJECT.replaceAll("'", "\"") : null)
      const currentProjectOpt2 = JSON.parse(message.json ? message.json.replaceAll("'", "\"") : null)
      const currentProject = currentProjectOpt1 || currentProjectOpt2
      if (!currentProject) return
      this.stateManager.updateState(credentialsKey + "_" + currentProject.name, message.credentials)
      const projectPath = currentProject ? currentProject.projectPath : null
      this.stateManager.setUserFolder(projectPath)
      if (message.credentials && message.credentials.length) this.stateManager.updateState(credentialsKey, message.credentials)
      return oldPreferences
    }
    async messageHandler (message) {
      if (!message) return;
      const oldPrefs = message.tfCommand ? this.handlePreferences(message) : null
      const { tfCommand, command } = message
      const { handler, launch } = this.commandsLauncher
      const cb = createCB(message, handler, this.render, oldPrefs, this.stateManager)
      const res = handleCommand( tfCommand || command, this.logger, handler, launch, cb, this ) 
      return res
    }
  
    initSideBarView () {
      const sideBarWebView = {
        enableScripts: true,
          resolveWebviewView: webviewView => {
            this.sideBarWebView = webviewView.webview;
            this.sideBarWebView.options = {
              enableScripts: true,
              retainContextWhenHidden: true
            };
            this.render()
            this.sideBarWebView.onDidReceiveMessage(this.messageHandler)
            webviewView.onDidDispose(() => {
              this.sideBarWebView && this.sideBarWebView.dispose();
            });
          }
        }
        this.sideBarWebViewProviderExplorer = vscode.window.registerWebviewViewProvider('terraform-button-view-explorer', sideBarWebView );
        this.sideBarWebViewProviderScm = vscode.window.registerWebviewViewProvider('terraform-button-view-scm', sideBarWebView );
        this.context.subscriptions.push(this.sideBarWebViewProvider);
        return sideBarWebView
    }

    async initProjectExplorer(withAnimation = true) {
      this.withAnimation = withAnimation
      this.projectExplorer && this.projectExplorer.dispose()
      tfProjectsCache = await getProjectsCache(tfProjectsCache)
      const panel  = vscode.window.createWebviewPanel(
        'terraformDashboard', // Identifies the type of the webview. Used internally
        'Terraform Dashboard', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        { enableScripts: true } // Webview options. More on these later.
      );
      panel.onDidDispose(() => {
        this.projectExplorer.disposed = true
      });
      this.projectExplorer = panel.webview
      this.projectExplorer.onDidReceiveMessage(
        async (message) => {
          const loggedMessage = typeof message === "string" ? { message, source: "explorer" } : message
          loggedMessage.source = "explorer"
          this.logger.log(loggedMessage)
          const res = await this.messageHandler(message);
          if (res === "render") this.render()
          const rawJson = message.json || message.CURRENT_PROJECT
          if (!rawJson) return res
          const parsed = JSON.parse(rawJson.replaceAll("'", "\""))
          const { credentials } = message
          parsed.credentials = credentials
          const json = JSON.stringify(parsed).replaceAll("\"", "'")
          const shouldUpdateProject = res == "selected-project" || json
          if (shouldUpdateProject) this.stateManager.updateState(selectedProjectJsonKey, json )
          return res
        },
        undefined,
        this.context.subscriptions
      )
      setTimeout(async () => { tfProjectsCache = await getProjectsCache(tfProjectsCache) })
      return panel
    }
    
    constructor(context, logger, stateManager, commandsLauncher){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
        this.commandsLauncher = commandsLauncher
        this.withAnimation = true
        this.commandLaunched = false
        this.render = this.render.bind(this)
        this.messageHandler = this.messageHandler.bind(this)
    }
}

module.exports = { WebViewManager }
