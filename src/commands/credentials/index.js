const vscode = require('vscode');
const { credentialsKey } = require("../../shared/constants")

class CredentialsHandler {
    logger
    context
    commandId
    stateManager

    static isPreference = true

    async execute () {
        this.stateManager.credentialsSetter = await vscode.window.showInputBox({
            prompt: 'Set cloud credentials:',
            ignoreFocusOut: true,
            value: '', // Initial value of the text area
            valueSelection: [0, 0], // Select the entire text initially
            multiline: true,
            placeHolder: 'For example: $Env:AWS_ACCESS_KEY_ID=... ; $Env:AWS_SECRET_ACCESS_KEY=...', // Placeholder text
        });
        this.stateManager.updateState(credentialsKey, this.stateManager.credentialsSetter) 
        this.webview.render()
    }

    constructor(context, logger, stateManager, webview) {
        this.logger = logger
        this.context = context
        this.webview = webview
        this.stateManager = stateManager
    }
}

module.exports = { CredentialsHandler }
