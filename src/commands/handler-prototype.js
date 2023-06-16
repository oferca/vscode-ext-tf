const os = require('os');
const vscode = require('vscode');
const { FileHandler } = require("../file-handler")
const { isPowershell } = require("../shared/methods")
const { BashHandler } = require("../shared/shells/bash")
const { PowershellHandler } = require("../shared/shells/powershell")

const {
    getOption,
    getOptionKey,
    getRawCommand
} = require("../shared/methods")

const {
    lastRunKey,
    runCountKey,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId
} = require("../shared/constants")

let defaultTarget
let defaultVarFile

const getDefaultOption = commandId =>
    [tfPlanTargetCommandId, tfApplyTargetCommandId].includes(commandId) && defaultTarget || 
    [tfPlanVarsCommandId, tfApplyVarsCommandId].includes(commandId) && defaultVarFile

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
    stateManager
    textDocumentListener

    async logOp() {
        const op = {
            cId: this.commandId,
            terminal: this.activeTerminal && this.activeTerminal.name
        }
        return await this.logger.log(op)
    }
    
    updateRunCount () {
        const now = new Date().getTime();
        this.stateManager.updateState(lastRunKey, now);
        let runCount = this.stateManager.getState(runCountKey)
        if (typeof runCount !== 'number') runCount = 0
        this.stateManager.updateState(runCountKey, runCount + 1)
    }

    async execute() {
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp()
            self.runBash()
        }
        await this.init(onChildProcessCompleteStep2)
       
    }

    initFileHandler(cb) {
        this.fileHandler = new FileHandler(
            this.commandId,
            this.averageFromCmd,
            this.context,
            this.logger,
            this.stateManager,
            this.shellHandler
        )
        this.fileHandler.init(cb)
    }

    async getOption() {
        return await getOption(
            this.commandId,
            getDefaultOption(this.commandId),
            this.stateManager.shellType
        )
    }

    async init(step2) {
        setDefaultOption(this.commandId, this.tfOption)
        this.tfOption = this.addOption ? (await this.getOption()) : null
        
        const { activeTerminal } = vscode.window
        const ShellHandler = isPowershell(activeTerminal) ? PowershellHandler : BashHandler

        this.shellHandler = new ShellHandler(
            this.commandId,
            this.tfOption,
            this.redirect,
            this.stateManager
        )

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

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
        this.init = this.init.bind(this)
        this.logOp = this.logOp.bind(this)
        this.runBash = this.runBash.bind(this)
        this.getOption = this.getOption.bind(this)
        this.sendCommands = this.sendCommands.bind(this)
        this.initFileHandler = this.initFileHandler.bind(this)
    }
}

module.exports = { CommandHandlerPrototype }
