const fs = require('fs');
const vscode = require('vscode');
const { html } = require("./page");
const { getActions } = require('../../shared/actions');
const { changeFolderKey, credentialsKey } = require("../../shared/constants");
const { handleCommand, createCB } = require('./messages');

class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    render(completed = false, tfCommand){

      // Parameter definitions
      const { fileHandler, shellHandler } = this.commandsLauncher.handler || {}
      const outputFileExists = this.commandsLauncher.handler && fileHandler && fileHandler.initialized
      const folder = this.stateManager.getState(changeFolderKey)
      const credentials = this.stateManager.getState(credentialsKey)
      let planSucceded = (tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1); // planSuccessful(this.outputFileContent)
      const preferences = { folder, credentials, showWarning: folder || credentials}
      
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
        this.commandLaunched
      ]
      const paramsExplorer = [...params]
      paramsExplorer.push(true)
      this.sideBarWebView.html = html(...params)
      this.projectExplorer.html = html(...paramsExplorer)
       
    }

    async messageHandler (message) {
      if (!message) return;

      const { tfCommand, command, namespace } = message
      const { handler, launch } = this.commandsLauncher
      const cb = createCB(message, handler, this.render)
      // TODO: Switch Namespace 
      handleCommand( tfCommand || command, this.logger, handler, launch, cb, this ) 
    }
  
    initSideBarView () {
      const sideBarWebView = {
        enableScripts: true,
          resolveWebviewView: webviewView => {
            this.sideBarWebView = webviewView.webview;
            this.sideBarWebView.options = { enableScripts: true };
            this.render()
            this.sideBarWebView.onDidReceiveMessage(this.messageHandler)
            webviewView.onDidDispose(() => {
              this.sideBarWebView.dispose();
            });
          }
        }
        this.sideBarWebViewProviderExplorer = vscode.window.registerWebviewViewProvider('terraform-button-view-explorer', sideBarWebView );
        this.sideBarWebViewProviderScm = vscode.window.registerWebviewViewProvider('terraform-button-view-scm', sideBarWebView );
        this.context.subscriptions.push(this.sideBarWebViewProvider);
    }

    initProjectExplorer() {
      this.projectExplorer = vscode.window.createWebviewPanel(
        'catCoding', // Identifies the type of the webview. Used internally
        'Cat Coding', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        { enableScripts: true } // Webview options. More on these later.
      ).webview;
      this.projectExplorer.onDidReceiveMessage(
        this.messageHandler,
        undefined,
        this.context.subscriptions
      )

    }

    init () {
        this.initSideBarView()
        this.initProjectExplorer()
    }
    
    constructor(context, logger, stateManager, commandsLauncher){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
        this.commandsLauncher = commandsLauncher
        this.intro = true
        this.commandLaunched = false
        this.render = this.render.bind(this)
        this.messageHandler = this.messageHandler.bind(this)
    }
}

module.exports = { WebViewManager }