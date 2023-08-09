const vscode = require('vscode');
const { getActions } = require("../shared/actions")
const {
    lastActionKey,
    lastOutputKey,
    credentialsKey,
    changeFolderKey,
    openTerminalTxt,
    pickACommandText,
    preferencesSetText,
} = require("../shared/constants")

class CommandsLauncher {
    logger
    handler
    uniqueId
    outputFile 
    stateManager
    handleSpinner

    async showQuickPick  () {
        this.handleSpinner && this.handleSpinner()
        let selection
        let tsAfter = 0
        let tsBefore = 0

        const labels = getActions(this.stateManager)
            .map(action => ({
                label: (action.icon || "") + "  " + action.label,
                kind: action.kind
            }))

        let showMenuAttempts = 0
        let selectionDurationMS = 0

        const preferencesSet = this.stateManager.getState(credentialsKey) ||  this.stateManager.getState(changeFolderKey)
        const placeHolder = preferencesSet ? preferencesSetText : pickACommandText

        while (!selection && (selectionDurationMS < 1000) && showMenuAttempts < 4){
            tsBefore = new Date().getTime()
            selection = await vscode.window.showQuickPick(labels, {
                placeHolder,
                title: "Execute Terraform Command"
            });
            tsAfter = new Date().getTime()
            selectionDurationMS = tsAfter - tsBefore
            showMenuAttempts++
        }
        
        selection && this.handleActionSelect(selection)
    }

    async handleActionSelect (selection) {
        const selected = selection.label.split(") ")[1].trim()
        return this.launch(selected)
    }

    async launch (actionLabel, source = "menu", outputUpdatedCallback = () => {}, completedCallback) {
        this.stateManager.activeTerminal = await this.verifyOpenTerminal(actionLabel)
        const CommandHandler = getActions(this.stateManager).find(action => (actionLabel === action.label || (action.matches && action.matches(actionLabel)))).handler
        this.handler = new CommandHandler( this.context, this.logger, this.stateManager)
        const isPreviousActionPlan = this.stateManager.getState(lastActionKey) && this.stateManager.getState(lastActionKey).toLowerCase().indexOf("plan") > -1
        const cbWithState = () => {
            completedCallback && completedCallback()
            const hasOutput = this.handler.fileHandler && this.handler.fileHandler.redirect
            if (!(this.handler.commandId && hasOutput)) return
            const outputFileContent = hasOutput  ? this.handler.fileHandler.getOutputFileContent() : this.stateManager.getState(lastOutputKey)
            this.stateManager.updateState(lastOutputKey, outputFileContent)
            this.stateManager.updateState(lastActionKey, actionLabel)        
        }
        this.handler.execute(source, cbWithState, outputUpdatedCallback)
        
        return this.handler
    }

    async verifyOpenTerminal(actionLabel) {
        if (vscode.window.activeTerminal) return vscode.window.activeTerminal
        if (actionLabel.toLowerCase().indexOf === "open explorer" > -1) return
        vscode.window.showInformationMessage( openTerminalTxt(actionLabel) );
        const terminal = await vscode.window.createTerminal();
        terminal.show();
        return terminal
    }
    
    constructor(context, logger, stateManager){
        this.logger = logger
        this.context = context
        this.stateManager = stateManager
        this.launch = this.launch.bind(this)
        this.showQuickPick = this.showQuickPick.bind(this)
        this.verifyOpenTerminal = this.verifyOpenTerminal.bind(this)
    }
}

module.exports = { CommandsLauncher }
