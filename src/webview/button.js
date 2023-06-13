const vscode = require('vscode');
const { mainCommandId, placeHolder } = require("../shared/constants")

class WebviewButton {

    init () {
        const webViewProvider = vscode.window.registerWebviewViewProvider('terraform-button-view', {
          enableScripts: true,
            resolveWebviewView: (webviewView) => {
              // Create and configure the webview
              const webview = webviewView.webview;
              webview.options = {
                enableScripts: true
              };
        
              webview.html =  `
              <html>
              <body>
                <button id="fff" onclick="runScript()">Run Script</button>
                <script>
                let vscode
                if (!vscode) vscode = acquireVsCodeApi();
                                  function runScript() {
                   
                    vscode.postMessage({ command: 'runScript', script: 'console.log("Hello from script!");' });
                  }
                </script>
              </body>
              </html>
            `;;
        
              // Handle messages from the webview
              webview.onDidReceiveMessage((message) => {
                if (message.command === 'runScript') {
                  vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');                }
              });
        
              // Dispose the webview when the view is closed
              webviewView.onDidDispose(() => {
                webview.dispose();
              });
            }
          });
        
          // Register the custom view provider
          this.context.subscriptions.push(webViewProvider);
         // vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');

    }
    
    constructor(context){
        this.context = context   
    }

}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
module.exports = { WebviewButton }
