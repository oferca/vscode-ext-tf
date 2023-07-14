const vscode = require('vscode');
const { mainCommandId, changeFolderKey, credentialsKey } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');

class WebviewButton {
    webViewProviderExplorer
    webViewProviderScm
    preferences
    intro

    render(handler, completed = false){
      this.webview.options = {
        enableScripts: true
      };
      this.actions = getActions(this.stateManager)
      this.preferences = {
        folder: this.stateManager.getState(changeFolderKey),
        credentials:  this.stateManager.getState(credentialsKey)
      }
      const hasActivePreferences = this.preferences.folder || this.preferences.credentials
      this.preferences.showWarning = hasActivePreferences 
      this.intro = this.intro === false ? false : this.intro && (!handler || (handler && !handler.redirect))
      this.webview.html = html(this.preferences, this.actions, Math.random(), this.intro, handler && handler.commandId, completed)
      this.stateManager.handleWebViewIntro()
    }
    init () {
      const webView = {
        enableScripts: true,
          resolveWebviewView: (webviewView) => {
            this.webview = webviewView.webview;
            this.render()
            this.webview.onDidReceiveMessage(async message => {
              if (!message) return;
              switch(message.command){
                case 'openTFLauncher':
                  vscode.commands.executeCommand(mainCommandId, 'workbench.view.easy-terraform-commands');
                  break;
                case 'openOutputFile':
                  vscode.workspace.openTextDocument(this.commandsLauncher.handler.fileHandler.outputFileNoColor).then(async (doc) => {
                    vscode.window.showTextDocument(doc); 
                  })
                  break;
                default:
                  if (!message.tfCommand) break;
                  const self = this
                  const handler = await this.commandsLauncher.launch(
                    message.tfCommand,
                    "webview",
                    () => setTimeout(() => self.render(handler, true))
                  )
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
    
    constructor(context, logger, stateManager, commandsLauncher){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
        this.commandsLauncher = commandsLauncher
        this.intro = true
    }
}
module.exports = { WebviewButton }
/*

 
    */