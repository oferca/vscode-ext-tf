const vscode = require('vscode');
const fs = require('fs');
const { openMenuCommandId, changeFolderKey, credentialsKey } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');
const { ChatGPTHandler }  = require('../commands/chat-gpt')

class WebviewButton {
  intro
  preferences
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    render(handler, completed = false, tfCommand){
      this.webview.options = { enableScripts: true };
      this.actions = getActions(this.stateManager)
      this.preferences = {
        folder: this.stateManager.getState(changeFolderKey),
        credentials:  this.stateManager.getState(credentialsKey)
      }
      const hasActivePreferences = this.preferences.folder || this.preferences.credentials
      this.preferences.showWarning = hasActivePreferences 
      let planSucceded = false
      const { fileHandler } = this.commandsLauncher.handler || {}
      if (this.commandsLauncher.handler && fileHandler && fileHandler.initialized)
        this.outputFileContent = fs.readFileSync(
          this.commandsLauncher.handler.fileHandler.outputFileNoColor,
          this.commandsLauncher.handler.shellHandler.fileEncoding)
      if (tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1){
        planSucceded = true; // planSuccessful(this.outputFileContent)
      }
      this.webview.html = html(this.preferences, this.actions, Math.random(), planSucceded, tfCommand, completed, this.commandLaunched)
      this.stateManager.handleWebViewIntro()
    }
    init () {
      const reRender = this.render
      const webView = {
        enableScripts: true,
          resolveWebviewView: (webviewView) => {
            this.webview = webviewView.webview;
            this.render()
            this.webview.onDidReceiveMessage(async message => {
              if (!message) return;
              switch(message.command){
                case 'openTFLauncher':
                  this.logger.log({ msg: "openTFLauncher", source: "webview" })
                  vscode.commands.executeCommand(openMenuCommandId, 'workbench.view.easy-terraform-commands');
                  break;
                case 'openOutputFile':
                  this.logger.log({ msg: "openOutputFile", source: "webview" })
                  vscode.workspace.openTextDocument(this.commandsLauncher.handler.fileHandler.outputFileNoColor).then(async (doc) => {
                    vscode.window.showTextDocument(doc); 
                  })
                  break;
                case 'chat-gpt':
                  if (!this.commandsLauncher.handler) return this.logger.log({ msg: "failed-chat-gpt", source: "webview"})
                  this.outputFileContent = fs.readFileSync(
                    this.commandsLauncher.handler.fileHandler.outputFileNoColor,
                    this.commandsLauncher.handler.shellHandler.fileEncoding)
                  await (new ChatGPTHandler(null, this.logger)).execute("webview", null, this.outputFileContent)
                  break;
                default:
                  if (!message.tfCommand) break;
                  this.commandLaunched = true
                  let handler
                  const cb = () => setTimeout(() => {
                    const { fileHandler, shellHandler } = this.commandsLauncher.handler
                    fileHandler && fileHandler.convertOutputToReadable()
                    if (fileHandler && fileHandler.initialized)
                      this.outputFileContent = fs.readFileSync(
                        fileHandler.outputFileNoColor,
                        shellHandler.fileEncoding)
                    reRender(handler, true, message.tfCommand)
                  })
                  this.outputFileContent = null
                  handler = await this.commandsLauncher.launch(
                    message.tfCommand,
                    "webview",
                    cb
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
        this.commandLaunched = false
        this.render = this.render.bind(this)
    }
}
module.exports = { WebviewButton }