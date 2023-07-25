const fs = require('fs');
const vscode = require('vscode');
const { html } = require("./page");
const { getActions } = require('../../shared/actions');
const { changeFolderKey, credentialsKey } = require("../../shared/constants");
const { handleCommand } = require('./messages');

class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    render(completed = false, tfCommand){

      // Parameter definitions
      const { handler } = this.commandsLauncher
      const { fileHandler } = handler || {}
      const outputFileExists = handler && fileHandler && fileHandler.initialized
      const folder = this.stateManager.getState(changeFolderKey)
      const credentials = this.stateManager.getState(credentialsKey)
      const hasActivePreferences = folder || credentials
      const showWarning = hasActivePreferences 
      let planSucceded = (tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1); // planSuccessful(this.outputFileContent)
      const preferences = { folder, credentials, showWarning }
      
      // Update output
      this.outputFileContent = outputFileExists ? fs.readFileSync( handler.fileHandler.outputFileNoColor, handler.shellHandler.fileEncoding) : undefined

      // Render
      this.sideBarWebView.html = html(
        preferences,
        getActions(this.stateManager),
        Math.random(),
        planSucceded,
        tfCommand,
        completed,
        this.commandLaunched
      )
    }

    async messageHandler (message) {
      if (!message) return;
      const reRender = this.render
      const { handler, launch } = this.commandsLauncher
  
      const tfCommandCallback = () => {
          const { fileHandler, shellHandler } = handler
          fileHandler && fileHandler.convertOutputToReadable()
          if (fileHandler && fileHandler.initialized)
          this.outputFileContent = fs.readFileSync(
              fileHandler.outputFileNoColor,
              shellHandler.fileEncoding)
          reRender(true, message.tfCommand)
      }
      
      handleCommand(message.tfCommand || message.command, this.logger, handler, launch, tfCommandCallback, this) 
    }
  

    init () {
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