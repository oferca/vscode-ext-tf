const fs = require('fs');
const vscode = require('vscode');
const { html } = require("./html");
const { actions } = require('../../shared/actions');

const {
  credentialsKey,
  changeFolderKey,
  credentialsSetText,
  selectedProjectPathKey,
  lastSelectedProjectPathKey
} = require("../../shared/constants");

const {
  getProjectsCache,
  createWebviewPanel,
  getNamespacedCredentialsKey
} = require("../../shared/methods");

const { handleCommand, createCompletedCallback } = require('./messages');

let tfProjectsCache = null;
class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    async render(completed = false, tfCommand, missingCredentials, feedback, isExplorer = true){

      const folder = this.stateManager.getState(changeFolderKey),
        namespacedCredentialsKey = getNamespacedCredentialsKey(folder),
        credentials = this.stateManager.getState(namespacedCredentialsKey),
        showWarning = folder || credentials,
        preferences = { folder, credentials, showWarning },
        params = [
          preferences,
          actions,
          Math.random(),
          hasPlan(tfCommand),
          tfCommand,
          completed,
          this.withAnimation,
          this.commandLaunched
        ]

      this.updateOutputFile()

      if (this.sideBarWebView) this.sideBarWebView.html = html(...params)
      if (!this.projectExplorer || !isExplorer) return

      tfProjectsCache = (await getProjectsCache(tfProjectsCache))
        .map(this.addCredentials)
      
      const paramsExplorer = [...params]
      const selected = this.selectedProject || {}
      selected.credentials = credentials ? credentialsSetText : ""

      const lastSelectedProject = tfProjectsCache.find(project => project.projectPath === this.stateManager.getState(lastSelectedProjectPathKey))
      if (lastSelectedProject) lastSelectedProject.lastModifiedTimestamp = Date.now()

      paramsExplorer.push(
        tfProjectsCache,
        this.selectedProject,
        this.context,
        this.stateManager,
        this.outputFileContent,
        missingCredentials,
        feedback
      )
      
      this.projectExplorer.html = html(...paramsExplorer)
      this.withAnimation = false
    }

    handlePreferences(message) {
      if (!message.folder) return
     // if (!message.isExplorer) return

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
        completedCallback = createCompletedCallback(
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
        completedCallback,
        this,
        message,
        this.stateManager
       ) 
       
      return res
    }
  
    initSideBarView () {
      this.init()
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
      this.init()
      this.withAnimation = withAnimation
      this.projectExplorer && this.projectExplorer.dispose()

      await this.updateProjectsCache()
      if (!tfProjectsCache) return
      const { subscriptions } = this.context,
      missingProjects = !tfProjectsCache || tfProjectsCache.length < 2
      if (missingProjects) return // vscode.window.showInformationMessage(noProjectsExistsTxt)

      const panel = createWebviewPanel()
      panel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, "assets", "terraform_logo.png");
      this.projectExplorer = panel.webview
      this.projectExplorer.onDidReceiveMessage(this.handleWebviewMessage, undefined, subscriptions )

      setTimeout(this.updateProjectsCache)
      return panel
    }

    init () {
      this.stateManager.webViewManager = this
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
      const selectedProject = tfProjectsCache.find(p => p.projectPath === selectedProjectPath)
      return selectedProject
    }
    
    addCredentials (project) {
        project.credentials = this.stateManager.getState(getNamespacedCredentialsKey(project.projectPath)) || ""
        return project
    }

    updateOutputFile () {
      try {
        const { handler } =  this.commandsLauncher,
        { fileHandler, shellHandler } = handler || {},
        outputFileExists = fileHandler && fileHandler.initialized
        this.outputFileContent = outputFileExists ? fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding) : undefined
      }catch(e){} // output file might not exist
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
        this.addCredentials = this.addCredentials.bind(this)
        this.handleWebviewMessage = this.handleWebviewMessage.bind(this)
    }
}


(async () => { tfProjectsCache = await getProjectsCache(tfProjectsCache) })()
const hasPlan = str => (str || "").toLowerCase().indexOf("plan") > -1

module.exports = { WebViewManager }
