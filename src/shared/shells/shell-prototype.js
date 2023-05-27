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

    constructor(commandId, tfOption = null, redirect = true, outputFile, lifecycleManager) {
        this.commandId = commandId
        this.tfOption = tfOption
        this.redirect = redirect
        this.outputFile = outputFile
        this.lifecycleManager = lifecycleManager
    }
}

module.exports = { ShellHandler }