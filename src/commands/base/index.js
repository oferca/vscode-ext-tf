const vscode = require('vscode');
const { FileHandler } = require("../../file-handler")
const { isPowershell } = require("../../shared/methods")
const { BashHandler } = require("../../shared/shells/bash")
const { PowershellHandler } = require("../../shared/shells/powershell")

const {
    getOption,
    getOptionKey,
    getRawCommand
} = require("../../shared/methods")

const {
    optionKey,
    lastRunKey,
    runCountKey,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId
} = require("../../shared/constants")

let defaultTarget
let defaultVarFile
const hideInitialDefinitionsDelay = 1000

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
    logger
    addOption
    commandId
    titleColor
    fileHandler
    stateManager
    averageFromCmd
    textDocumentListener
    requiresInitialization

    async logOp(source) {
        const op = {
            source,
            cId: this.commandId,
            terminal: this.stateManager.activeTerminal && this.stateManager.activeTerminal.name
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

    async execute(source, cb) {
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp(source)
            self.runBash(cb)
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
        setDefaultOption(this.commandId, this.stateManager.getState(optionKey))
        const newOption =  this.addOption ? (await this.getOption()) : null
        this.stateManager.updateState(optionKey, newOption)
        
        const { activeTerminal } = this.stateManager
        const ShellHandler = isPowershell(activeTerminal) ? PowershellHandler : BashHandler

        this.shellHandler = new ShellHandler(
            this.commandId,
            this.stateManager.getState(optionKey),
            this.redirect,
            this.stateManager
        )

        const onChildProcessCompleteStep1 = async () => {
            const { activeTerminal } = this.stateManager
            if (!activeTerminal) return
            await step2()
        }
        if (!this.fileHandlerInitialized){
            this.overlayTerminal = vscode.window.createTerminal();
            this.overlayTerminal.show();
        }
       
        this.shellHandler.deleteTerminalCurrentLine()
        this.redirect ? this.initFileHandler(onChildProcessCompleteStep1) : onChildProcessCompleteStep1()
    }

    get fileHandlerInitialized () {
        return this.fileHandler && this.fileHandler.initialized
    }

    async runBash(cb) {
        setTimeout(() => {
            this.sendCommands(cb)
        }, !(this.fileHandlerInitialized) ? 500 : 0)
    }

    async sendCommands(cb = () => {}) {
        const { activeTerminal } = this.stateManager
        const command = getRawCommand(this.commandId)
        const option = this.addOption ? `-${getOptionKey(this.commandId)}="${this.stateManager.getState(optionKey)}"` : ""
        this.fileHandler && this.fileHandler.initialized ? await this.shellHandler.runTfCommand(this.outputFile, this.requiresInitialization)
            : activeTerminal.sendText(`terraform ${command} ${option}`)
        if (this.overlayTerminal) setTimeout(() =>
            {
                this.overlayTerminal.dispose()
                this.activeTerminal && this.activeTerminal.show();
            }, hideInitialDefinitionsDelay);
        cb()
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
