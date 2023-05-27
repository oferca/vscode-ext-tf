const vscode = require('vscode');
const { actions } = require("../shared/actions")

class CommandsLauncher {
    logger
    uniqueId
    handleSpinner
    lifecycleManager

    async showQuickPick  () {
        this.handleSpinner && this.handleSpinner()
        let selection
        let tsBefore = 0
        let tsAfter = 0

        const labels = actions.map(action => ({
            label: (action.icon || "") + "  " + action.label,
            kind: action.kind
        }))
    
        while (!selection && ((tsAfter - tsBefore) < 1000)){
            tsBefore = new Date().getTime()
            selection = await vscode.window.showQuickPick(labels, {
                placeHolder: 'Pick a terraform command to run in terminal (\u2318\u21E7T)',
                title: "Execute Terraform Command"
            });
            tsAfter = new Date().getTime()
        }
        
        selection && this.handleActionSelect(selection)
    }

    handleActionSelect (selection) {
        const selected = selection.label.split(") ")[1].trim()
        const CommandHandler = actions.find(action => selected === action.label).handler
        const commandHandler = new CommandHandler( this.context, this.logger, this.lifecycleManager )
        return commandHandler.execute()
    }
    
    constructor(context, logger, lifecycleManager){
        this.logger = logger
        this.context = context
        this.lifecycleManager = lifecycleManager
        this.showQuickPick = this.showQuickPick.bind(this)
    }
}

module.exports = { CommandsLauncher }
