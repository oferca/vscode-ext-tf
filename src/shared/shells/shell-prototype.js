const vscode = require('vscode');
const { isWindows, credentialsKey, changeFolderKey } = require("../constants")

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
        const changedCredentials = activeTerminal.tfCredentials !== this.stateManager.credentials
        if (changedCredentials) activeTerminal.sendText(this.getInitShellCommands())
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
        const folder = this.stateManager.selectedFolder || this.stateManager.getState(changeFolderKey)
        return folder ? `cd "${folder}";` :""
    }
    
    getCredentialsSetter() {
        const credentials = this.stateManager.credentials || this.stateManager.getState(credentialsKey)
        return credentials ? credentials + ";" : ""
    }
    
    getInitShellCommands() {
        return `
        ${this.getChangeFolderCmd()}
        ${this.getCredentialsSetter()}`
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