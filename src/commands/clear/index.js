const { changeFolderKey } = require("../../shared/constants")

class ClearStateHandler {
    logger
    context
    commandId
    stateManager

    async execute (source, cb = () => {}) {
        this.stateManager.updateState(changeFolderKey, undefined) 
        cb()
    }

    constructor(context, logger, stateManager) {
        this.logger = logger
        this.context = context
        this.stateManager = stateManager
    }
}

module.exports = { ClearStateHandler }
