const vscode = require('vscode');

class ShellHandler {
    lifecycleManager

    async handleDefinitions() {
        const { activeTerminal } = vscode.window
        if (!activeTerminal.definitions) activeTerminal.definitions = {}
        const bashDefined = activeTerminal.definitions[this.commandId + (this.tfOption || "")]
        const definitions = this.tfCommandDefinitions();
        if (!bashDefined) activeTerminal.sendText(definitions)
        activeTerminal.definitions[this.commandId] = true
    }

    async runTfCommand (outputFile) {
        const { activeTerminal } = vscode.window
        await this.handleDefinitions()
        activeTerminal.sendText(`clear`);
        activeTerminal.sendText(`terraform.${this.commandId} ${this.paramName}"${outputFile}" \ `);
        activeTerminal.show();
    }

    constructor(commandId, tfOption = null, redirect = true, lifecycleManager) {
        this.commandId = commandId
        this.tfOption = tfOption
        this.redirect = redirect
        this.lifecycleManager = lifecycleManager
    }
}

module.exports = { ShellHandler }