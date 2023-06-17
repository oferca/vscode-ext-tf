const vscode = require('vscode');

class ChangeFolderHandler {
    logger
    context
    commandId
    stateManager

    async execute () {
        const projectRootUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri
        const options =     {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Terraform Folder',
        defaultUri: projectRootUri
        };
    
        const folderUri = await vscode.window.showOpenDialog(options);
        const folder = folderUri && folderUri[0].path
        this.stateManager.setUserFolder(folder) 
    }

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
    }
}

module.exports = { ChangeFolderHandler }
