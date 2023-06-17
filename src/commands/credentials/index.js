const vscode = require('vscode');
const { credentialsKey } = require("../../shared/constants")

class CredentialsHandler {
    logger
    context
    commandId
    stateManager

    async execute () {
        this.stateManager.credentialsSetter = await vscode.window.showInputBox({
            prompt: 'Set cloud credentials:',
            ignoreFocusOut: true,
            value: '', // Initial value of the text area
            valueSelection: [0, 0], // Select the entire text initially
            multiline: true,
            placeHolder: 'For example: SET AWS_ACCESS_KEY_ID=... ', // Placeholder text
        });
        this.stateManager.updateState(credentialsKey, this.stateManager.credentialsSetter) 

    }

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
    }
}

module.exports = { CredentialsHandler }
