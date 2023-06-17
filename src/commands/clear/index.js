const { credentialsKey } = require("../../shared/constants")

class ClearHandler {
    logger
    context
    commandId
    stateManager

    async execute () {
        this.stateManager.updateState(credentialsKey, undefined) 
        this.stateManager.updateState(changeFolderKey, undefined) 
    }

    constructor(context, logger, stateManager, commandId) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.stateManager = stateManager
    }
}

module.exports = { ClearHandler }
