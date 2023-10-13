const fs = require('fs');
const vscode = require('vscode');
const { ChatGPTHandler }  = require('../../commands/chat-gpt')
const {
    reRenderTimout,
    openMenuCommandId,
    selectedProjectPathKey,
    disableShowOnStartupKey,
    lastSelectedProjectPathKey
} = require("../../shared/constants")

module.exports.handleCommand = async (command, logger, launchHandler, launch, tfCommandCallback, webViewManager, message, stateManager) =>
{
    logger.log({ command, source: "webview" })
    switch(command){
        case 'openTFLauncher':
            vscode.commands.executeCommand(openMenuCommandId, 'workbench.view.easy-terraform-commands');
            break;

        case 'openOutputFile':
            launchHandler.fileHandler && vscode.workspace.openTextDocument(launchHandler.fileHandler.outputFileNoColor)
                .then(vscode.window.showTextDocument)
            break;

        case 'ChatGPT Synopsis':
            if (!launchHandler || !launchHandler.fileHandler) return logger.log({ message: "failed-chat-gpt", source: "webview"})
            webViewManager.outputFileContent = fs.readFileSync(
                launchHandler.fileHandler.outputFileNoColor,
                launchHandler.shellHandler.fileEncoding)
            await (new ChatGPTHandler(null, logger)).execute("webview", null, webViewManager.outputFileContent)
            break;
        case 'selected-project':
            stateManager.updateState(selectedProjectPathKey, message.projectPath )
            stateManager.updateState(lastSelectedProjectPathKey, message.projectPath )
            stateManager.openProjectTerminal(message.projectPath)
            return command
            break;
        case 'unselected-project':
            stateManager.updateState(selectedProjectPathKey, null )
            stateManager.openPreviousTerminal()
            return command
            break;
        case 'show-on-startup':
            stateManager.updateState(disableShowOnStartupKey, false)
            break;
        case 'dont-show-on-startup': 
            stateManager.updateState(disableShowOnStartupKey, true)
            break;
        default:
            if (!command) break;
            if (command === "render") return command

            webViewManager.commandLaunched = true

            const outputUpdatedCallback = (outputFileContent, completionPercentage) => {
                webViewManager
                .projectExplorer
                .postMessage({ outputFileContent, completionPercentage });
                webViewManager.outputFileContent = outputFileContent
            }

            const completedCallback = feedback => setTimeout(() => tfCommandCallback(feedback))
            webViewManager.outputFileContent = null

            await launch(
                command,
                "webview",
                message.isExplorer ? outputUpdatedCallback : undefined,
                completedCallback
            )
  }
}

module.exports.createCompletedCallback = (message, handler, reRender, oldPrefs, stateManager) => feedback => {
    if (oldPrefs){
        stateManager.setUserFolder(oldPrefs.userFolder)
    }
    setTimeout(() => reRender(true, message.tfCommand, feedback, !!message.isExplorer),
    reRenderTimout)
    
    if (!handler) return
    const { fileHandler, shellHandler } = handler
    if (!fileHandler) return
    fileHandler.convertOutputToReadable()
    try {
        this.outputFileContent = fileHandler.initialized ?
        fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding)
        : undefined
    }
    catch(e){}
   
    
  }
  