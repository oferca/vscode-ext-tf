const vscode = require('vscode');

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
        openLabel: 'Select Terraform Folder'
        };
    
        const folderUri = await vscode.window.showOpenDialog(options);
        if (!folderUri || !folderUri[0]) return
        this.stateManager.selectedFolder = folderUri[0].fsPath;       
    }

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
    }
}

module.exports = { ChangeFolderHandler }
