const { mainCommandId, placeHolder } = require("./shared/constants")
,

class ActionButton {

    vsCodeButton

    init (spinner = false) {
        this.vsCodeButton && this.vsCodeButton.hide()
        this.vsCodeButton && this.vsCodeButton.dispose()

        const button = vscode.window.createStatusBarItem(1, 0)
        button.text = `${spinner ? "$(gear~spin)" : "$(terminal)"} Terraform`
        button.tooltip = placeHolder
        button.command = mainCommandId
        button.show()
        this.vsCodeButton = button
        return button
    }
    
    constructor(context){
        this.context = context   
        this.spinner = false
    }

}

module.exports = { ActionButton }
