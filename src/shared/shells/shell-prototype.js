const vscode = require('vscode');
const { isWindows, credentialsKey } = require("../constants")

class ShellHandler {
    fileEncoding
    stateManager
    terminalNoticeText
    terminalNoticeTextL2

    async handleDefinitions() {
        const { activeTerminal } = vscode.window
        if (!activeTerminal.definitions) activeTerminal.definitions = {}
        const bashDefined = activeTerminal.definitions[this.commandId + (this.tfOption || "")]
        const definitions = this.tfCommandDefinitions();
        const newCredentials = activeTerminal.tfCredentials !== this.stateManager.credentials
        const newFolder = activeTerminal.tfFolder !== this.stateManager.getUserFolder() 
        const stateChanged = newCredentials || newFolder
        if (stateChanged) this.getInitShellCommands().filter(c => c != null).forEach(activeTerminal.sendText)
        activeTerminal.tfCredentials = this.stateManager.credentials
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

    getChangeFolderCmd() {
        const folder = this.stateManager.getUserFolder()
        return folder ? `cd "${folder}";` :""
    }
    
    getCredentialsSetter() {
        return this.stateManager.credentials || this.stateManager.getState(credentialsKey)
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