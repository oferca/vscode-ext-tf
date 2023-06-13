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
              setTimeout(() => webview.postMessage({ action: 'toggle' }), 3000)
              webview.html =  `
              <html>
              <head>
              <style>
              .button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                transition: background-color 0.3s;
                max-width: 300px;
                /*font-size: 13px;*/
                letter-spacing: 0.5px;
                margin-block-start: 1em;
                box-sizing: border-box;
                display: flex;
                width: 100%;
                padding: 4px;
                border-radius: 2px;
                text-align: center;
                cursor: pointer;
                justify-content: center;
                align-items: center;
                border: 1px solid var(--vscode-button-border,transparent);
                line-height: 18px;
              }
              
              .button:hover {
                background-color: var(--vscode-button-hoverBackground);
              }
              
              .button:active {
                background-color: --vscode-textLink-activeForeground;
              }
              button.display{
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
              }
              </style>
              </head>
              <body>
                <button class="button" id="button" onclick="runScript()">Run Terraform</button>
                <script>
                window.addEventListener('message', event => {
                  document.getElementById("button").classList.add("display")
                  setTimeout(() => {
                    document.getElementById("button").classList.remove("display")
                  }, 300)
                });
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
