const vscode = require('vscode');
const { FileHandler } = require("../../file-handler")
const { BashHandler } = require("../../shared/shells/bash")
const { isPowershell } = require("../../shared/methods-cycle")
const { PowershellHandler } = require("../../shared/shells/powershell")


const {
    getOption,
    getOptionKey,
    getRawCommand,
    featuresDisabled
} = require("../../shared/methods")

const {
    optionKey,
    lastRunKey,
    runCountKey,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId,
    tfInitUpgradeCommandId,
    tfForceUnlockCommandId
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
        if (featuresDisabled(this.stateManager.activeTerminal)) return await vscode.window.showInformationMessage("Please use supported terminal such as powershell or bash")
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp(source)
            if (this.executeHook) await this.executeHook()
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
            this.shellHandler,
            this.transformOutputColors
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

    async init(runCommandScriptCallback) {
        setDefaultOption(this.commandId, this.stateManager.getState(optionKey))
        const newOption =  this.addOption ? (await this.getOption()) : null
        this.stateManager.updateState(optionKey, newOption)
        
        const { activeTerminal } = this.stateManager
        const ShellHandler = isPowershell(activeTerminal) ? PowershellHandler : BashHandler

        this.shellHandler = new ShellHandler(
            this.commandId,
            this.stateManager.getState(optionKey),
            this.redirect,
            this.stateManager,
            this.transformOutputColors
        )

        const onChildProcessCompleteStep1 = async () => {
            const { activeTerminal } = this.stateManager
            if (!activeTerminal) return
            await runCommandScriptCallback()
        }
        if (!this.fileHandlerInitialized){
            this.overlayTerminal = vscode.window.createTerminal();
            this.overlayTerminal.show();
        }
       
        await this.shellHandler.deleteTerminalCurrentLine()
        this.redirect ? this.initFileHandler(onChildProcessCompleteStep1) : onChildProcessCompleteStep1()
    }

    get fileHandlerInitialized () {
        return this.fileHandler && this.fileHandler.initialized
    }

    async runBash(cb) {
        setTimeout(() => {
            this.sendCommands(cb)
        }, !(this.fileHandlerInitialized) ? 1000 : 500)
    }

    async sendCommands(cb = () => {}) {
        // Appologies for overcomplication
        const command = getRawCommand(this.commandId)
        const option = this.stateManager.getState(optionKey)
        let options = this.addOption ? (option || "").split(",").reduce((optionsStr, option) => {
            const par = this.commandId.indexOf("var.file") > -1 ? "\"" : "'"
            optionsStr += ` -${getOptionKey(this.commandId)}=${par}${option.trim()}${par}`
            if (this.commandId === tfInitUpgradeCommandId) return "-upgrade"
            if (this.commandId === tfForceUnlockCommandId) return ""
            return optionsStr
        }, "") : ""
        if (this.commandId === tfForceUnlockCommandId) options = option
        this.redirect ? await this.shellHandler.runTfCommand(this.outputFile)
            : this.shellHandler.runSimpleCommand(command, options)
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
