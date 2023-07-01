const vscode = require('vscode');
const { credentialsKey } = require("../../shared/constants")

class CredentialsHandler {
    logger
    context
    commandId
    stateManager

    async execute (source, cb = () => {}) {
        this.stateManager.credentialsSetter = await vscode.window.showInputBox({
            prompt: 'Set cloud credentials:',
            ignoreFocusOut: true,
            value: '', // Initial value of the text area
            valueSelection: [0, 0], // Select the entire text initially
            multiline: true,
            placeHolder: 'For example: $Env:AWS_ACCESS_KEY_ID=... ; $Env:AWS_SECRET_ACCESS_KEY=...', // Placeholder text
        });
        this.stateManager.updateState(credentialsKey, this.stateManager.credentialsSetter) 
        cb()
    }

    constructor(context, logger, stateManager, webview) {
        this.logger = logger
        this.context = context
        this.webview = webview
        this.stateManager = stateManager
    }
}

module.exports = { CredentialsHandler }
