const vscode = require('vscode');
const { ChatGPTHandler }  = require('../../commands/chat-gpt')
const { openMenuCommandId } = require("../../shared/constants")

module.exports.handleCommand = async (command, logger, launchHandler, launch, tfCommandCallback, webViewManager, tfProject) =>
{
    switch(command){
        case 'openTFLauncher':
            logger.log({ msg: "openTFLauncher", source: "webview" })
            vscode.commands.executeCommand(openMenuCommandId, 'workbench.view.easy-terraform-commands');
            break;

        case 'openOutputFile':
            logger.log({ msg: "openOutputFile", source: "webview" })
            vscode.workspace.openTextDocument(launchHandler.fileHandler.outputFileNoColor).then(async (doc) => {
                vscode.window.showTextDocument(doc); 
            })
            break;

        case 'chat-gpt':
            if (!launchHandler) return logger.log({ msg: "failed-chat-gpt", source: "webview"})
            webViewManager.outputFileContent = fs.readFileSync(
                launchHandler.fileHandler.outputFileNoColor,
                launchHandler.shellHandler.fileEncoding)
            await (new ChatGPTHandler(null, logger)).execute("webview", null, webViewManager.outputFileContent)
            break;
        case 'selected-project':
            return command
            break;

        default:
            if (!command) break;
            if (command === "render") return command
            webViewManager.commandLaunched = true
            const cb = () => setTimeout(tfCommandCallback)
            webViewManager.outputFileContent = null
            await launch(
                command,
                "webview",
                cb,
                tfProject
            )
  }
}

module.exports.createCB = (message, handler, reRender) => () => {
    reRender(true, message.tfCommand)
    const { fileHandler, shellHandler } = handler
    if (!fileHandler) return
    fileHandler.convertOutputToReadable()
    this.outputFileContent = fileHandler.initialized ? fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding) : undefined
  }
  