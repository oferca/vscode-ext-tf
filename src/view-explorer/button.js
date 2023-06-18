const vscode = require('vscode');
const { mainCommandId, changeFolderKey, credentialsKey } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');

class WebviewButton {
    webViewProvider
    render(){
      this.webview.options = {
        enableScripts: true
      };
      this.actions = getActions(this.stateManager)
      this.preferences = {
        folder: this.stateManager.getState(changeFolderKey),
        credentials:  this.stateManager.getState(credentialsKey)
      }
      this.webview.html =  html(this.preferences, this.actions);
    }
    init () {
        this.webViewProvider = vscode.window.registerWebviewViewProvider('terraform-button-view', {
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
                  this.launcher.launch(message.tfCommand)
                }
              })
              webviewView.onDidDispose(() => {
                this.webview.dispose();
              });
            }
          });
          this.context.subscriptions.push(this.webViewProvider);
    }
    
    constructor(context, logger, stateManager){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
    }
}
module.exports = { WebviewButton }
