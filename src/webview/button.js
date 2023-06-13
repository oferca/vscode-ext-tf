const vscode = require('vscode');
const { mainCommandId } = require("../shared/constants")
const { html } = require("./page")

class WebviewButton {

    init () {
        const webViewProvider = vscode.window.registerWebviewViewProvider('terraform-button-view', {
          enableScripts: true,
            resolveWebviewView: (webviewView) => {
              const webview = webviewView.webview;
              webview.options = {
                enableScripts: true
              };
              webview.html =  html;
        
              webview.onDidReceiveMessage((message) => {
                if (message.command === 'openTFLauncher') {
                  vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');                }
              });
        
              webviewView.onDidDispose(() => {
                webview.dispose();
              });
            }
          });
        
          this.context.subscriptions.push(webViewProvider);
    }
    
    constructor(context){
        this.context = context   
    }
}
module.exports = { WebviewButton }
