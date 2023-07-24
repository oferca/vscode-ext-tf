const vscode = require('vscode');
const { placeHolder } = require("./shared/constants")

class ActionButton {

    commandId
    buttonText
    vsCodeButton

    init (spinner = false) {
        this.vsCodeButton && this.vsCodeButton.hide()
        this.vsCodeButton && this.vsCodeButton.dispose()

        const button = vscode.window.createStatusBarItem(1, this.placement)
        button.text = this.buttonText
        button.tooltip = placeHolder
        button.command = this.commandId
        button.show()
        this.vsCodeButton = button
        return button
    }
    
    constructor(context, logger, commandId, buttonText, placement){
        this.context = context
        this.placement = placement
        this.buttonText = buttonText
        this.commandId = commandId
        this.logger = logger
        this.spinner = false
    }

}

module.exports = { ActionButton }
