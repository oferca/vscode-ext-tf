const vscode = require('vscode');

class ChangeFolderHandler {
    logger
    context
    stateManager

    async execute (source, cb = () => {}) {
        const projectRootUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri
        const options = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Terraform Folder',
            defaultUri: projectRootUri
        };
    
        const folderUri = await vscode.window.showOpenDialog(options);
        const folder = folderUri && folderUri[0].path
        this.stateManager.setUserFolder(folder) 
        cb()
    }

    constructor(context, logger, stateManager, webview) {
        this.logger = logger
        this.context = context
        this.webview = webview
        this.stateManager = stateManager
    }
}

module.exports = { ChangeFolderHandler }
