const vscode = require('vscode');
const { handleFirstActivation, createTerraformButton, showQuickPick } = require("./shared/methods")
const { mainCommandId } = require("./shared/constants")
const { actions } = require("./shared/actions")
const disposables = []

async function activate(context) {
    let button, cb
	let isFirst = true
	disposables.forEach(d => d.dispose())
	const uniqueId = new Date().valueOf()
	
	const commandRegistration = vscode.commands.registerCommand(
		mainCommandId,
		() => showQuickPick(actions, uniqueId, isFirst, cb, context)
	)
	disposables.push(commandRegistration);

	button = createTerraformButton(disposables, isFirst)

	const nullifyFirst =() => { isFirst = false }
	isFirst = await handleFirstActivation(context, nullifyFirst, uniqueId)
    
	cb = () => {
		button.hide()
		button.dispose()
		button = createTerraformButton(disposables)
	}
	
	!isFirst && cb()
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
