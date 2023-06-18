const vscode = require('vscode');
const { mainCommandId } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');

class WebviewButton {
    init () {
        const webViewProvider = vscode.window.registerWebviewViewProvider('terraform-button-view', {
          enableScripts: true,
            resolveWebviewView: (webviewView) => {
              const webview = webviewView.webview;
              webview.options = {
                enableScripts: true
              };
              const actions = getActions(this.stateManager)
              webview.html =  html({
                folder: "aaa",
                credentials: "bbb"
              }, actions);
        
              webview.onDidReceiveMessage(message => {
                if (!message) return;
                if (message.command === 'openTFLauncher') {
                  vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');    
                }
                if (message.tfCommand){
                  const CommandHandler = actions.find(action => message.tfCommand === action.label).handler
                  const commandHandler = new CommandHandler( this.context, this.logger, this.stateManager )
                  return commandHandler.execute()
                }
              })
              webviewView.onDidDispose(() => {
                webview.dispose();
              });
            }
          });
          this.context.subscriptions.push(webViewProvider);
    }
    
    constructor(context, logger, stateManager){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
    }
}
module.exports = { WebviewButton }
