const vscode = require('vscode');
const path = require('path');
const { Logger } = require("./shared/logger")
const { openMenuCommandId, openProjectsCommandId, openMenuButtonText, openProjectsButtonText} = require("./shared/constants")
const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { WebViewManager } = require("./view/main")
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
		const openMenuButton = new ActionButton(context, logger, openMenuCommandId, openMenuButtonText, 0)
		const openProjectsButton = new ActionButton(context, logger, openProjectsCommandId, openProjectsButtonText, 1)
		const launcher = new CommandsLauncher(context, logger, stateManager)
		const webViewManager = new WebViewManager(context, logger, stateManager, launcher)

		logger.stateManager = stateManager
		stateManager.init()

		const commandRegistration = vscode.commands.registerCommand(
			openMenuCommandId,
			() => {
				disposables.push(openMenuButton.init())
				launcher.showQuickPick()
			}
		)
		const projetsCommandRegistration = vscode.commands.registerCommand(
			openProjectsCommandId,
			async () => {
				// disposables.push(openMenuButton.init())
				disposables.push(await webViewManager.initProjectExplorer())
				await webViewManager.render()
			}
		)

		
		disposables.push(commandRegistration)
		disposables.push(projetsCommandRegistration)
		disposables.push(openMenuButton.init(true))
		disposables.push(openProjectsButton.init(true))
		disposables.push(webViewManager.initSideBarView())
		disposables.push(webViewManager.initProjectExplorer())
		
		await stateManager.notifyFirstActivation()
		!stateManager.isFirstActivation && openMenuButton.init()

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
