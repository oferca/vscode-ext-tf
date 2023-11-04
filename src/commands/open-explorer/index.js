const vscode = require('vscode');
const {
	openProjectsCommandId,
} = require("../../shared/constants")

class OpenExplorerHandler {
    logger
    context

    async execute (source) {
        vscode.commands.executeCommand(openProjectsCommandId)
    }

    constructor(context, logger) {
        this.logger = logger
        this.context = context
    }
}

module.exports = { OpenExplorerHandler }
