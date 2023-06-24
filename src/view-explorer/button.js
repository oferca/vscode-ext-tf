const vscode = require('vscode');
const { mainCommandId, changeFolderKey, credentialsKey } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');

class WebviewButton {
    webViewProviderExplorer
    webViewProviderScm
    preferences

    render(){
      this.webview.options = {
        enableScripts: true
      };
      this.actions = getActions(this.stateManager)
      const firstPreferences = !this.preferences
      this.preferences = {
        folder: this.stateManager.getState(changeFolderKey),
        credentials:  this.stateManager.getState(credentialsKey)
      }
      const hasActivePreferences = this.preferences.folder || this.preferences.credentials
      this.preferences.showWarning = firstPreferences && hasActivePreferences 
      this.webview.html =  html(this.preferences, this.actions);
    }
    init () {
      const webView = {
        enableScripts: true,
          resolveWebviewView: (webviewView) => {
            this.webview = webviewView.webview;
            this.render()
            this.webview.onDidReceiveMessage(message => {
              if (!message) return;
              if (message.command === 'openTFLauncher') {
                vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');    
              }
              if (message.tfCommand){
                this.launcher.launch(message.tfCommand, "webview")
              }
            })
            webviewView.onDidDispose(() => {
              this.webview.dispose();
            });
          }
        }
        this.webViewProviderExplorer = vscode.window.registerWebviewViewProvider('terraform-button-view-explorer', webView );
        this.webViewProviderScm = vscode.window.registerWebviewViewProvider('terraform-button-view-scm', webView );
          this.context.subscriptions.push(this.webViewProvider);
    }
    
    constructor(context, logger, stateManager){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
    }
}
module.exports = { WebviewButton }
