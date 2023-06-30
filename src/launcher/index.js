const vscode = require('vscode');
const { getActions } = require("../shared/actions")
const {
    credentialsKey,
    changeFolderKey,
    openTerminalTxt,
    pickACommandText,
    preferencesSetText
} = require("../shared/constants")

class CommandsLauncher {
    logger
    handler
    uniqueId
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

    async launch(actionLabel, source = "menu") {
        this.stateManager.activeTerminal = await this.verifyOpenTerminal(actionLabel)
        const CommandHandler = getActions(this.stateManager).find(action => actionLabel === action.label).handler
        this.handler = new CommandHandler( this.context, this.logger, this.stateManager, CommandHandler.isPreference ? this.webview : undefined )
        return this.handler.execute(source)
    }
    
    async verifyOpenTerminal(actionLabel) {
        if (vscode.window.activeTerminal) return vscode.window.activeTerminal
        vscode.window.showInformationMessage( openTerminalTxt(actionLabel) );
        const terminal = await vscode.window.createTerminal();
        terminal.show();
        return terminal
    }
    
    constructor(context, logger, stateManager){
        this.logger = logger
        this.context = context
        this.stateManager = stateManager
        this.showQuickPick = this.showQuickPick.bind(this)
        this.verifyOpenTerminal = this.verifyOpenTerminal.bind(this)
    }
}

module.exports = { CommandsLauncher }
