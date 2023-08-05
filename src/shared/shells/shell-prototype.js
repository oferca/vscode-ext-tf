const { isWindows, credentialsKey } = require("../constants")

class ShellHandler {
    fileEncoding
    stateManager
    terminalNoticeText
    terminalNoticeTextL2

    async handleDefinitions() {
        const { activeTerminal } = this.stateManager
        if (!activeTerminal.definitions) activeTerminal.definitions = {}
        const bashDefined = activeTerminal.definitions[this.commandId + (this.tfOption || "")]
        const definitions = this.tfCommandDefinitions();
        this.getInitShellCommands().filter(c => c != null).forEach(activeTerminal.sendText)
        activeTerminal.tfCredentials = this.stateManager.getState(credentialsKey)
        activeTerminal.tfFolder = this.stateManager.getUserFolder() 
        if (!bashDefined) activeTerminal.sendText(definitions)
        activeTerminal.definitions[this.commandId] = true
    }

    async runTfCommand (outputFile) {
        const { activeTerminal } = this.stateManager
        await this.handleDefinitions()
        activeTerminal.sendText(`clear`);
        activeTerminal.sendText(`terraform.${this.commandId} ${this.paramName}"${outputFile}" \ `);
    }

    synthesizePath(_path) {
        return _path
    }
    getChangeFolderCmd() {
        const folder = this.stateManager.getUserFolder()
        return folder ? `cd "${folder}";` :""
    }
    
    getCredentialsSetter() {
        return this.stateManager.getState(credentialsKey) || ""
    }

    constructor(commandId, tfOption = null, redirect = true, stateManager) {
        this.commandId = commandId
        this.tfOption = tfOption
        this.redirect = redirect
        this.stateManager = stateManager
        this.fileEncoding = isWindows ? "UTF-16LE" : "utf-8"
    }
}

module.exports = { ShellHandler }