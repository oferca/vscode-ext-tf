const { credentialsKey, changeFolderKey } = require("../../shared/constants")

class ClearStateHandler {
    logger
    context
    commandId
    stateManager

    static isPreference = true
    
    async execute () {
        this.stateManager.updateState(credentialsKey, undefined) 
        this.stateManager.updateState(changeFolderKey, undefined) 
        this.webview.render()
    }

    constructor(context, logger, stateManager, webview) {
        this.logger = logger
        this.context = context
        this.webview = webview
        this.stateManager = stateManager
    }
}

module.exports = { ClearStateHandler }
