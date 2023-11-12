const { isWindows, noColorExt, tofuKey } = require("../constants")
const { sendTextShell } = require("./helpers")

class ShellHandler {
    par
    cmd
    fileEncoding
    stateManager
    outputFileExt
    terminalNoticeText
    terminalNoticeTextL2

    async handleDefinitions(simpleMode = false) {
        this.cmd = this.stateManager && this.stateManager.getState(tofuKey) ? "tofu" : "terraform"
        const { activeTerminal } = this.stateManager
        if (!activeTerminal.definitions) activeTerminal.definitions = {}
        const bashDefined = activeTerminal.definitions[this.commandId + (this.tfOption || "") + this.cmd]
        const definitions = simpleMode ? null : this.tfCommandDefinitions();
        const shellCommands = this.getInitShellCommands().filter(c => c != null)
        for (let key in shellCommands){
            await sendTextShell(activeTerminal, shellCommands[key])
        }
        activeTerminal.tfFolder = this.stateManager.getUserFolder()
        if (simpleMode) return
        if (!bashDefined) await sendTextShell(activeTerminal, definitions)
        activeTerminal.definitions[this.commandId] = true
    }

    async runTfCommand (outputFile, options) {
        const { activeTerminal } = this.stateManager

        await this.handleDefinitions()
        await sendTextShell(activeTerminal, `clear`);
        await sendTextShell(activeTerminal, `terraform.${this.commandId} ${this.paramName}"${outputFile}" '${options}'\ `);
    }

    async runSimpleCommand (command, options) {
        const { activeTerminal } = this.stateManager
        await this.handleDefinitions(true)
        await sendTextShell(activeTerminal, `${this.cmd} ${command} ${options}`)
    }

    synthesizePath(_path) {
        return _path
    }

    getChangeFolderCmd() {
        const folder = this.stateManager.getUserFolder()
        return folder ? `cd "${folder}";` :""
    }
    

    constructor(commandId, tfOption = null, redirect = true, stateManager, transformOutputColors, sendConsoleOutput = true) {
        this.commandId = commandId
        this.tfOption = tfOption
        this.redirect = redirect
        this.stateManager = stateManager
        this.sendConsoleOutput = sendConsoleOutput
        this.fileEncoding = isWindows ? "UTF-16LE" : "utf-8"
        this.outputFileExt = transformOutputColors ? `.${noColorExt}` : ""
        this.par = commandId && commandId.indexOf("var.file") > -1 ? "'" : "\""
    }
}

module.exports = { ShellHandler }