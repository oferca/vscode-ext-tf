const vscode = require('vscode');

class WebViewHandler {
    outputFile
    commandId

    refresh(text) {
        this.panel.webview.postMessage({ text: text || 'Hello from extension!' });
    }
    init() {
        const capitalized = this.commandId.charAt(0).toUpperCase() + this.commandId.slice(1)
        const panel = vscode.window.createWebviewPanel(
            'Terraform', // Unique identifier for the panel
            this.commandId, // Title displayed in the panel
            vscode.ViewColumn.One, // Position of the panel (e.g., beside the editor)
            {
              enableScripts: true // Enable JavaScript in the webview
            }
          );
          panel.webview.html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="Content-type" content="text/html; charset=utf-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src vscode-resource: 'unsafe-inline'; style-src vscode-resource: 'unsafe-inline';">
            <title>My Webview</title>
          </head>
          <body>
            abc
            <script>

            // Receive messages from the extension
            window.addEventListener('message', event => {
                const message = event.data;
                document.body.innerHTML = JSON.stringify(message)
            });
            </script>

          </body>
          </html>`
        this.panel = panel
    }
    constructor(outputFile, commandId){
        this.outputFile = outputFile
        this.commandId = commandId
    }
}

module.exports = { WebViewHandler }