const os = require('os');
const vscode = require('vscode');
const { FileHandler } = require("../file-handler")
const {
    getOption,
    getOptionKey,
    getRawCommand,
    tfCommandBashDefinitions
} = require("../shared/methods")

const {
    lastRunKey,
    openTerminalTxt,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId
} = require("../shared/constants")

let defaultTarget
let defaultVarFile

const getDefaultOption = commandId =>
    (commandId === tfPlanTargetCommandId || commandId === tfApplyTargetCommandId) && defaultTarget || 
    (commandId === tfPlanVarsCommandId || commandId === tfApplyVarsCommandId) && defaultVarFile

const setDefaultOption = (commandId, option) =>{
    if (commandId === tfPlanTargetCommandId) defaultTarget = option
    if (commandId === commandId) defaultVarFile = option
}

class CommandHandlerPrototype {
    db
    abort
    redirect = true
    tfOption = null
    logger
    addOption
    commandId
    titleColor
    fileHandler
    averageFromCmd
    activeTerminal
    lifecycleManager
    textDucumentListener

    async logOp() {
        const op = {
            cId: this.commandId,
            terminal: this.activeTerminal.name
        }
        return await this.logger.log(op)
    }
    async verifyOpenTerminal() {
        const openTerminal = { title: 'Open Terminal' };
        const selection = await vscode.window.showInformationMessage(
            openTerminalTxt,
            openTerminal
        );

        await this.logger.log({
            openTerminalTxt,
            selection,
            commandId: this.commandId 
        })

        if (selection === openTerminal) {
            const terminal = vscode.window.createTerminal();
            terminal.show();
        }
    }
    async execute() {
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp()
            if (!vscode.window.activeTerminal) return await self.verifyOpenTerminal()
            self.runBash()
        }
        await this.init(onChildProcessCompleteStep2)
       
    }

    initFileHandler(cb) {
        this.fileHandler = new FileHandler(this.commandId, this.averageFromCmd, this.context, this.logger, this.lifecycleManager)
        this.fileHandler.init(cb)
    }

    async getOption() {
        return await getOption(this.commandId, getDefaultOption(this.commandId))
    }

    async init(step2) {
        this.tfOption = this.addOption ? (await this.getOption()) : null
        setDefaultOption(this.commandId, this.tfOption)
        const onChildProcessCompleteStep1 = async () => {
            const { activeTerminal } = vscode.window
            if (!activeTerminal) return
            this.activeTerminal = activeTerminal
            const isWindows = os.platform().indexOf("win32") > -1
            if (isWindows) this.redirect = false
            await step2()
        }
        this.initFileHandler(onChildProcessCompleteStep1)
    }

    async handleDefinitions(activeTerminal) {
        if (!activeTerminal.definitions) activeTerminal.definitions = {}
        const bashDefined = activeTerminal.definitions[this.commandId + (this.tfOption || "")]
        const definitions = tfCommandBashDefinitions(this.commandId, this.tfOption, this.redirect);
        if (!bashDefined) activeTerminal.sendText(definitions)
        activeTerminal.definitions[this.commandId] = true
    }

    async runBash() {
        const now = new Date().getTime();
        this.lifecycleManager.updateState(lastRunKey, now);
        setTimeout(this.sendCommands, !this.fileHandler.initialized ? 500 : 0)
    }

    async sendCommands(tfOption = null) {
        const { activeTerminal } = vscode.window
        const command = getRawCommand(this.commandId)
        const option = this.addOption ? `-${getOptionKey(this.commandId)}="${this.tfOption}"` : ""
        if (!this.fileHandler.initialized) return activeTerminal.sendText(`terraform ${command} ${option}`)
        await this.handleDefinitions(activeTerminal)
        activeTerminal.sendText(`clear`);
        activeTerminal.sendText(`terraform.${this.commandId} "${this.outputFile}" "$(date +%s)"; \ `);
        activeTerminal.show();
    }

    get outputFile() {
        return this.fileHandler.outputFile
    }

    constructor(context, logger, lifecycleManager, commandId) {
        this.context = context
        this.logger = logger
        this.commandId = commandId
        this.lifecycleManager = lifecycleManager
        this.init = this.init.bind(this)
        this.logOp = this.logOp.bind(this)
        this.runBash = this.runBash.bind(this)
        this.getOption = this.getOption.bind(this)
        this.sendCommands = this.sendCommands.bind(this)
        this.initFileHandler = this.initFileHandler.bind(this)
        this.verifyOpenTerminal = this.verifyOpenTerminal.bind(this)
    }
}

module.exports = { CommandHandlerPrototype }
