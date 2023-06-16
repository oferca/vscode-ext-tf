const vscode = require('vscode');
const { actions } = require("../shared/actions")
const { openTerminalTxt } = require("../shared/constants")

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

        const labels = actions.map(action => ({
            label: (action.icon || "") + "  " + action.label,
            kind: action.kind
        }))

        let showMenuAttempts = 0
        let selectionDurationMS = 0
    
        while (!selection && (selectionDurationMS < 1000) && showMenuAttempts < 4){
            tsBefore = new Date().getTime()
            selection = await vscode.window.showQuickPick(labels, {
                placeHolder: 'Pick a terraform command to run in terminal (\u2318\u21E7T)',
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

        const CommandHandler = actions.find(action => selected === action.label).handler
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
