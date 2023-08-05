const vscode = require('vscode');
const {
	openProjectsCommandId,
} = require("../../shared/constants")

class OpenExplorerHandler {
    logger
    context

    async execute () {
        vscode.commands.executeCommand(openProjectsCommandId)
        this.logger.log("open-explorer-from-menu")
    }

    constructor(context, logger) {
        this.logger = logger
        this.context = context
    }
}

module.exports = { OpenExplorerHandler }
