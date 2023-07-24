const vscode = require('vscode');
const path = require('path');
const { Logger } = require("./shared/logger")
const { mainCommandId } = require("./shared/constants")
const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { WebviewButton } = require("./view/button.js")
const { ProjectViewer } = require("./view/project.js")
const { StateManager } = require("./state/index.js")

const appRoot = path.resolve(__dirname);
var pjson = require(appRoot + '/../package.json');

const debugMode = pjson.version.indexOf("debug") > -1
const disableState = debugMode && true
const freshStart = debugMode && true
const disableLogs = debugMode && true

const disposables = []

async function activate(context) {
	disposables.forEach(d => d.dispose())
	const logger = new Logger(disableLogs)
	try{

		const pref = freshStart ? Math.random() : ""
		const stateManager = new StateManager(context, logger, disableState, disableState, pref )
		const actionButton = new ActionButton(context, logger)
		const launcher = new CommandsLauncher(context, logger, stateManager)
		const webviewButton = new WebviewButton(context, logger, stateManager, launcher)

		const projectViewer = new ProjectViewer(context, logger, stateManager, launcher)
		await projectViewer.init()

		logger.stateManager = stateManager
		stateManager.init()

		const commandRegistration = vscode.commands.registerCommand(
			mainCommandId,
			() => {
				disposables.push(actionButton.init())
				launcher.showQuickPick()
			}
		)

		disposables.push(commandRegistration)
		disposables.push(actionButton.init(true))
		disposables.push(webviewButton.init())
		
		await stateManager.notifyFirstActivation()
		!stateManager.isFirstActivation && actionButton.init()

		vscode.window.onDidOpenTerminal(
			terminal => stateManager.handleTerminalNotice(terminal)
		);
	}catch(e){
		logger.logError(e)
	}
}

function deactivate() { }

  
module.exports = {
	activate,
	deactivate
}
