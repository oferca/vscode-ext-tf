const vscode = require('vscode');
const path = require('path');
const { Logger } = require("./shared/logger")
const {
	openMenuCommandId,
	openMenuButtonText,
	openProjectsCommandId,
	openProjectsButtonText
} = require("./shared/constants")

const { CommandsLauncher } = require("./launcher/index.js")
const { ActionButton } = require("./action-button.js")
const { WebViewManager } = require("./view/main")
const { StateManager } = require("./state/index.js")


const appRoot = path.resolve(__dirname);
var pjson = require(appRoot + '/../package.json');

const debugMode = pjson.version.indexOf("debug") > -1
const disableState = debugMode && true
const freshStart = debugMode && true
const disableLogs = debugMode && false

const disposables = []
let withAnimation = true

async function activate(context) {
	disposables.forEach(d => d.dispose())
	const logger = new Logger(disableLogs)
	let projectExplorerPanel
	try{
		const pref = freshStart ? Math.random() : ""
        
		const {
			stateManager,
			openMenuButton,
			openProjectsButton,
			launcher,
			webViewManager
		} = initHandlers(context, logger, disableState, pref )
		
		logger.stateManager = stateManager
		stateManager.init()

		const commandRegistration = vscode.commands.registerCommand(
			openMenuCommandId,
			() => {
				disposables.push(openMenuButton.init())
				launcher.showQuickPick()
			}
		)
		vscode.commands.registerCommand(
			openProjectsCommandId,
			async () => {
				const explorerOpen = projectExplorerPanel && projectExplorerPanel.q && !projectExplorerPanel.q.isDisposed
				if (explorerOpen) return projectExplorerPanel.reveal(vscode.ViewColumn.One)
				projectExplorerPanel = webViewManager.initProjectExplorer(withAnimation)
				withAnimation = false
				disposables.push(projectExplorerPanel)
				await webViewManager.render()
			}
		)
		setTimeout(async () => {
			// projectExplorerPanel = await webViewManager.initProjectExplorer()
			// await webViewManager.render()
		})

		const toDispose = [
			commandRegistration,
			openMenuButton.init(true),
			openProjectsButton.init(true),
			webViewManager.initSideBarView()
		].forEach(x => disposables.push(x))
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

function initHandlers (context, logger, disableState, pref ) {

    const stateManager = new StateManager(context, logger, disableState, disableState, pref ),
        openMenuButton = new ActionButton(context, logger, openMenuCommandId, openMenuButtonText, 0),
        openProjectsButton = new ActionButton(context, logger, openProjectsCommandId, openProjectsButtonText, 1),
        launcher = new CommandsLauncher(context, logger, stateManager),
        webViewManager = new WebViewManager(context, logger, stateManager, launcher)

    return {
        stateManager,
        openMenuButton,
        openProjectsButton,
        launcher,
        webViewManager
    }
}

module.exports = {
	activate,
	deactivate
}
