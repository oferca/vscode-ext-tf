const vscode = require('vscode');
const { handleFirstActivation, createTerraformButton, stopSpinner } = require("./shared/methods")
const { mainCommandId } = require("./shared/constants")
const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { LifecycleManager } = require("./lifecycle/index.js")
const disposables = []

async function activate(context) {
	disposables.forEach(d => d.dispose())

	const lifecycle = new LifecycleManager(context)
	const actionButton = new ActionButton(context)
	const launcher = new CommandsLauncher(context)

	const commandRegistration = vscode.commands.registerCommand(
		mainCommandId,
		() => {
			disposables.push(actionButton.init())
			launcher.showQuickPick()
		}
	)
	disposables.push(commandRegistration)
	disposables.push(actionButton.init(true))

	const isFirstActivation = await handleFirstActivation(context, launcher.uniqueId)
	!isFirstActivation && actionButton.init()
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
