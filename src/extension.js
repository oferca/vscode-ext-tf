const vscode = require('vscode');
const { Logger } = require("./shared/logger")
const { mainCommandId } = require("./shared/constants")
const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { LifecycleManager } = require("./lifecycle/index.js")

const debugMode = false
const disableState = debugMode && false
const freshStart = debugMode && false
const disableLogs = debugMode && true

const disposables = []

async function activate(context) {
	disposables.forEach(d => d.dispose())
	const logger = new Logger(disableLogs)
	const pref = freshStart ? Math.random() : ""
	const lifecycleManager = new LifecycleManager(context, logger, disableState, disableState, pref )
	const actionButton = new ActionButton(context, logger)
	const launcher = new CommandsLauncher(context, logger, lifecycleManager)

	lifecycleManager.init()
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

	vscode.window.onDidOpenTerminal(terminal => {
		lifecycleManager.handleTerminalNotice(terminal)
	});
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
