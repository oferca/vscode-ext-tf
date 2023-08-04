const fs = require('fs');
const vscode = require('vscode');
const { html } = require("./html");
const { getActions } = require('../../shared/actions');

const {
  credentialsKey,
  changeFolderKey,
  credentialsSetText,
  noProjectsExistsTxt,
  selectedProjectPathKey
} = require("../../shared/constants");

const {
  getProjectsCache,
  createWebviewPanel,
  getNamespacedCredentialsKey
} = require("../../shared/methods");
const { handleCommand, createCB } = require('./messages');

let tfProjectsCache = null;

class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    async render(completed = false, tfCommand){

      const folder = this.stateManager.getState(changeFolderKey),
         credentials = this.stateManager.getState(credentialsKey),
         showWarning = folder || credentials,
         preferences = { folder, credentials, showWarning },
         params = [
          preferences,
          getActions(this.stateManager),
          Math.random(),
          hasPlan(str),
          tfCommand,
          completed,
          this.commandLaunched
        ]

      this.updateOutputFile()

      if (this.sideBarWebView) this.sideBarWebView.html = html(...params)
      if (!this.projectExplorer) return

      tfProjectsCache = (await getProjectsCache(tfProjectsCache))
        .map(this.addCredentials)
      
      const paramsExplorer = [...params]

      paramsExplorer.push(
        tfProjectsCache,
        this.selectedProject,
        this.withAnimation,
        this.context
      )

      this.projectExplorer.html = html(...paramsExplorer)
      this.withAnimation = false
    }


    handlePreferences(message) {
      if (!message.folder) return

      const credentialsAlreadySet = message.credentials === credentialsSetText,
        explorerCredentialsNamespace = getNamespacedCredentialsKey(message.folder),
        credentialsToUse = credentialsAlreadySet ? this.stateManager.getState(explorerCredentialsNamespace) : message.credentials,
        oldPreferences = {
          userFolder: this.stateManager.getUserFolder(),
          credentials: this.stateManager.getState(credentialsKey)
        }  
      
      this.stateManager.updateState(explorerCredentialsNamespace, credentialsToUse)
      this.stateManager.updateState(credentialsKey, credentialsToUse)
      this.stateManager.setUserFolder(message.folder)

      return oldPreferences
    }
    async messageHandler (message) {
      if (!message) return;

      const oldPrefs = message.tfCommand ? this.handlePreferences(message) : null,
        { tfCommand, command } = message,
        { handler, launch } = this.commandsLauncher,
        cb = createCB(
        message,
        handler,
        this.render,
        oldPrefs,
        this.stateManager
      )

      const res = handleCommand(
        tfCommand || command,
        this.logger,
        handler,
        launch,
        cb,
        this
       ) 
       
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
            webviewView.onDidDispose(() => this.sideBarWebView && this.sideBarWebView.dispose());
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

      await this.updateProjectsCache()
      const { subscriptions } = this.context,
      missingProjects = !tfProjectsCache || !tfProjectsCache.length
      if (missingProjects) return vscode.window.showInformationMessage(noProjectsExistsTxt)

      this.projectExplorer = createWebviewPanel().webview
      this.projectExplorer.webview.onDidReceiveMessage( this.handleWebviewMessage, undefined, subscriptions )

      setTimeout(this.updateProjectsCache)
      return panel
    }

    async handleWebviewMessage (message){
        this.log(message)
        const res = await this.messageHandler(message);
        if (res === "render") this.render()
        return res
      }

    log(message){
      const loggedMessage = typeof message === "string" ? { message, source: "explorer" } : message
      loggedMessage.source = "explorer"
      this.logger.log(loggedMessage)
    }

    async updateProjectsCache() {
      tfProjectsCache = await getProjectsCache(tfProjectsCache)
    }

    get selectedProject () {
      const selectedProjectPath = this.stateManager.getState(selectedProjectPathKey) || ""
      return tfProjectsCache.find(p => p.projectPath === selectedProjectPath)
    }
    
    addCredentials (project) {
        project.credentials = this.stateManager.getState(getNamespacedCredentialsKey(project)) || ""
        return project
    }

    updateOutputFile () {
      const { handler } =  this.commandsLauncher,
       { fileHandler, shellHandler } = handler || {},
      outputFileExists = fileHandler && fileHandler.initialized

      this.outputFileContent = outputFileExists ? fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding) : undefined
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


(async () => { tfProjectsCache = await getProjectsCache(tfProjectsCache) })()
const hasPlan = str => (str || "").toLowerCase().indexOf("plan") > -1

module.exports = { WebViewManager }