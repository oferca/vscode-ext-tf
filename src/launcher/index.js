const vscode = require('vscode');
const { getActions } = require("../shared/actions")
const {
    credentialsKey,
    openTerminalTxt,
    changeFolderKey,
    pickACommandText,
    preferencesSetText
} = require("../shared/constants")

class CommandsLauncher {
    logger
    uniqueId
    handleSpinner
    stateManager

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
        const { activeTerminal } = vscode.window
        if (!activeTerminal) return await this.verifyOpenTerminal()
        const selected = selection.label.split(") ")[1].trim()

        const CommandHandler = getActions(this.stateManager).find(action => selected === action.label).handler
        const commandHandler = new CommandHandler( this.context, this.logger, this.stateManager )
        return commandHandler.execute()
    }
    
    async verifyOpenTerminal() {
        const openTerminal = { title: 'Open Terminal' };
        const selection = await vscode.window.showInformationMessage( openTerminalTxt, openTerminal );

        await this.logger.log({
            openTerminalTxt,
            selection
        })

        if (selection === openTerminal) {
            const terminal = vscode.window.createTerminal();
            terminal.show();
        }
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
