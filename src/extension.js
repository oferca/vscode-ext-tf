const vscode = require('vscode');
const { Logger } = require("./shared/logger")
const { mainCommandId } = require("./shared/constants")
const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { LifecycleManager } = require("./lifecycle/index.js")
const disposables = []

const debugMode = true
const disableState = debugMode && true
const freshStart = debugMode && false
const disableLogs = debugMode && true

async function activate(context) {
	disposables.forEach(d => d.dispose())

    const logger = new Logger(disableLogs)
	const lifecycleManager = new LifecycleManager(context, logger, disableState, disableState, freshStart ? Math.random() : "")
	const actionButton = new ActionButton(context, logger)
	const launcher = new CommandsLauncher(context, logger, lifecycleManager)

	const commandRegistration = vscode.commands.registerCommand(
		mainCommandId,
		() => {
			disposables.push(actionButton.init())
			launcher.showQuickPick()
		}
	)
	disposables.push(commandRegistration)
	disposables.push(actionButton.init(true))

	await lifecycleManager.notifyFirstActivation()
	!lifecycleManager.isFirstActivation && actionButton.init()
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
