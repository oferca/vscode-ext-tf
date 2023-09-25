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
    tfForceUnlockCommandId,
    tfResourcesSelectionKey,
    lastSelectedProjectPathKey
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
    _abort
    redirect = true
    logger
    addOption
    commandId
    titleColor
    fileHandler
    stateManager
    skipTFCommand
    averageFromCmd
    overlayTerminal
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
        if (this._abort) return
        if (featuresDisabled(this.stateManager.activeTerminal)) return await vscode.window.showInformationMessage("Please use supported terminal such as powershell or bash")
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp(source)
            if (this.executeHook) await this.executeHook(source)
            if (this.skipTFCommand) return cb && cb()
            self.runBash(cb)
        }
        await this.init(onChildProcessCompleteStep2)
       
    }

    initFileHandler(cb = () => {}) {
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
        if (this._abort) return
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
            this.transformOutputColors,
        )

        const onChildProcessCompleteStep1 = async () => {
            const { activeTerminal } = this.stateManager
            if (!activeTerminal) return
            await runCommandScriptCallback()
        }
        if (!this.redirect && this.commandId.indexOf(".target") === -1){
            this.overlayTerminal && this.overlayTerminal.dispose()
            this.overlayTerminal = vscode.window.createTerminal();
            this.overlayTerminal.show();
        }
       
        if (!this.skipTFCommand) await this.shellHandler.deleteTerminalCurrentLine()
        this.redirect ? this.initFileHandler(onChildProcessCompleteStep1) : onChildProcessCompleteStep1()
    }

    get fileHandlerInitialized () {
        return this.fileHandler && this.fileHandler.initialized
    }

    async runBash(cb) {
        if (this._abort) return
        setTimeout(() => {
            this.sendCommands(cb)
        }, !(this.redirect) ? 1000 : 500)
    }

    async sendCommands(cb = () => {}) {
        // Appologies for overcomplication
        if (this._abort) return
        const command = getRawCommand(this.commandId)

        const trResourcesKey = tfResourcesSelectionKey + this.stateManager.getState(lastSelectedProjectPathKey)
        const targets = this.stateManager.getState(trResourcesKey)
        if (this.multipleTargetSelection) this.stateManager.updateState(optionKey, targets)

        const option = this.stateManager.getState(optionKey)
        let options = this.addOption ? (option || "").split(",").reduce((optionsStr, option) => {
            const par = this.commandId.indexOf("var.file") > -1 ? "'" : "\""
            optionsStr += ` -${getOptionKey(this.commandId)}=${par}${option.trim().replaceAll("\"","\\\"")}${par}`
            if (this.commandId === tfInitUpgradeCommandId) return "-upgrade"
            if (this.commandId === tfForceUnlockCommandId) return ""
            return optionsStr
        }, "") : ""
        if (this.commandId === tfForceUnlockCommandId) options = option
        this.shellHandler.sendConsoleOutput = this.sendConsoleOutput
        this.redirect ? await this.shellHandler.runTfCommand(this.outputFile, options)
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

    abort () {
        this._abort = true
        this.logger.log({msg: "abort"})
    }
    constructor(context, logger, stateManager, commandId) {
        this._abort = false
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
