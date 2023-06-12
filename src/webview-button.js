const vscode = require('vscode');
const { mainCommandId, placeHolder } = require("./shared/constants")

class WebviewButton {

    init () {
        const webViewProvider = vscode.window.registerWebviewViewProvider('terraform-button-view', {
            resolveWebviewView: (webviewView) => {
              // Create and configure the webview
              const webview = webviewView.webview;
              webview.html = '<h1>Hello, Webview!</h1>';
        
              // Handle messages from the webview
              webview.onDidReceiveMessage((message) => {
                // Handle the message from the webview here
              });
        
              // Dispose the webview when the view is closed
              webviewView.onDidDispose(() => {
                webview.dispose();
              });
            }
          });
        
          // Register the custom view provider
          this.context.subscriptions.push(webViewProvider);
          vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');

    }
    
    constructor(context){
        this.context = context   
    }

}
module.exports = { WebviewButton }
