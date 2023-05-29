const vscode = require('vscode');
const os = require('os');
const { FileHandler } = require("../file-handler")
const { BashHandler } = require("../shared/shells/bash")
const { PowershellHandler } = require("../shared/shells/powershell")
const { isPowershell } = require("../shared/methods")

const {
    getOption,
    getOptionKey,
    getRawCommand
} = require("../shared/methods")

const {
    lastRunKey,
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
    
    async execute() {
        const self = this
        const now = new Date().getTime();
        this.lifecycleManager.updateState(lastRunKey, now);
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp()
            self.runBash()
        }
        await this.init(onChildProcessCompleteStep2)
       
    }

    initFileHandler(cb) {
        this.fileHandler = new FileHandler(this.commandId, this.averageFromCmd, this.context, this.logger, this.lifecycleManager, this.shellHandler)
        this.fileHandler.init(cb)
    }

    async getOption() {
        return await getOption(this.commandId, getDefaultOption(this.commandId), this.lifecycleManager.shellType)
    }

    async init(step2) {
        this.tfOption = this.addOption ? (await this.getOption()) : null
        setDefaultOption(this.commandId, this.tfOption)
        
        const { activeTerminal } = vscode.window
        const ShellHandler = isPowershell(activeTerminal) ? PowershellHandler: BashHandler
        this.shellHandler = new ShellHandler(this.commandId, this.tfOption, this.redirect, this.lifecycleManager)

        const onChildProcessCompleteStep1 = async () => {
            const { activeTerminal } = vscode.window
            if (!activeTerminal) return
            this.activeTerminal = activeTerminal
            await step2()
        }
        this.initFileHandler(onChildProcessCompleteStep1)
    }

    async runBash() {
        setTimeout(this.sendCommands, !this.fileHandler.initialized ? 500 : 0)
    }

    async sendCommands(tfOption = null) {
        const { activeTerminal } = vscode.window
        const command = getRawCommand(this.commandId)
        const option = this.addOption ? `-${getOptionKey(this.commandId)}="${this.tfOption}"` : ""
        if (!this.fileHandler.initialized) return activeTerminal.sendText(`terraform ${command} ${option}`)
        await this.shellHandler.runTfCommand(this.outputFile)
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
    }
}

module.exports = { CommandHandlerPrototype }
