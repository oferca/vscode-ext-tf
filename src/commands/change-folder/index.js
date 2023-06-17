const vscode = require('vscode');
const { changeFolderKey } = require("../../shared/constants")

class ChangeFolderHandler {
    logger
    context
    commandId
    stateManager

    async execute () {
        const options = {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Terraform Folder',
        defaultUri: vscode.workspace.workspaceFolders[0].uri
        };
    
        const folderUri = await vscode.window.showOpenDialog(options);
        const folder = folderUri && folderUri[0]
        this.stateManager.selectedFolder = folder ? folder.fsPath : undefined 
        this.stateManager.updateState(changeFolderKey, this.stateManager.selectedFolder) 
    }

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
    }
}

module.exports = { ChangeFolderHandler }
