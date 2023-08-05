const { isWindows, credentialsKey } = require("../constants")
const { sendTextShell } = require("./helpers")

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
        const shellCommands = this.getInitShellCommands().filter(c => c != null)
        for (let key in shellCommands){
            await sendTextShell(activeTerminal, shellCommands[key])
        }
        activeTerminal.tfCredentials = this.stateManager.getState(credentialsKey)
        activeTerminal.tfFolder = this.stateManager.getUserFolder() 
        if (!bashDefined) await sendTextShell(activeTerminal, definitions)
        activeTerminal.definitions[this.commandId] = true
    }

    async runTfCommand (outputFile) {
        const { activeTerminal } = this.stateManager
        await this.handleDefinitions()
        await sendTextShell(activeTerminal, `clear`);
        await sendTextShell(activeTerminal, `terraform.${this.commandId} ${this.paramName}"${outputFile}" \ `);
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