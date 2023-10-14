const fs = require('fs');
const os = require('os');
const path = require("path")
const vscode = require('vscode');

const { 
    timeExt,
    targetTxt,
    tfVarsPostix,
    rootFolderName,
    tfTargetPostix,
    powershellType,
    tfUpgradePostix,
    initSuccessMessage,
    initEmptyDirMessage,
    planSuccessMessage1,
    planSuccessMessage2,
    tfForceUnlockPostix,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfInitUpgradeCommandId,
    validateSuccessMessage,
    tfForceUnlockCommandId,
} = require("./constants")

const { findFilesWithExtension } = require("../view/main/helpers")

const maxPercentage = 98

let colorIterator = 0
const folderColors = {}

module.exports.createOutputFileName = (dataFolder, commandId) => {
    const filename = "terraform-" + commandId + "-" + new Date().toISOString().replaceAll(":","-") + "." + commandId + ".txt"
    return path.join(dataFolder, filename)
}

const median = arr => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

module.exports.calculateAverageDuration = (dataFolder, commandId, encoding) => {
    const durations = []
    const filenames = fs.readdirSync(dataFolder + "/");

    filenames.forEach((name) => {
      const isDuration = name.indexOf("." + commandId + ".txt." + timeExt) > -1
      if (!isDuration) return

      const fullPath = path.join(dataFolder, name);
      const file = fs.readFileSync(fullPath, encoding);
      const decimalOnly = /\d/.test(file)
      if (!decimalOnly) return

      const duration = parseFloat(file)
      if (duration > 3) durations.push(duration)
    });
    return median(durations)
}

module.exports.getLastStateList = (dataFolder, encoding) => {
    const filenames = fs.readdirSync(dataFolder + "/");
    let mostRecent = 0
    let stateListFile = ""
    let total = 0
    filenames.forEach((name) => {
      const isStateList = name.indexOf(".state.list") > -1
      const isTimeFile = name.indexOf(`.${timeExt}`) > -1
      if (!isStateList || isTimeFile) return
      total++
      const lastUpdate = fs.statSync(path.resolve(dataFolder, name)).mtimeMs;
      if (lastUpdate < mostRecent) return
      mostRecent = lastUpdate
      stateListFile = path.resolve(dataFolder, name)
    });

    return stateListFile ? {
        content: fs.readFileSync(stateListFile, encoding),
        ts: mostRecent,
        total
    } : null
}

const getOptionKey = commandId =>
    commandId.indexOf(tfTargetPostix) > -1 && "target" ||
    commandId.indexOf(tfVarsPostix) > -1 && "var-file" ||
    commandId.indexOf(tfUpgradePostix) > -1 && "upgrade" ||
    commandId.indexOf(tfForceUnlockPostix) > -1 && ""

const addFolderColor = project => {
    const colors = [
        undefined,
        "#fee4cb",
        "#e9e7fd",
        "#ffd3e2",
        "#c8f7dc",
        "#d5deff"
    ]
    project.folderColor = project.folderColor || colors[colorIterator]
    colorIterator++
    if (colorIterator > colors.length - 1) colorIterator = 0
}

module.exports.getOptionKey = getOptionKey

const getRawCommand = commandId => commandId.
    replace(tfTargetPostix, "").
    replace(tfVarsPostix, "").
    replace(tfUpgradePostix, "").
    replace(tfForceUnlockPostix, "")

module.exports.getRawCommand = getRawCommand

module.exports.getCompletionPercentage = (barCreationTimestamp, barCompletionTimestamp, isDefaultDuration = false) => {
    const now = Date.now()
    const currentProgress = (now - barCreationTimestamp)
    let estimatedDuration = barCompletionTimestamp - barCreationTimestamp
    if (isDefaultDuration) estimatedDuration = estimatedDuration * ( 1 + currentProgress / estimatedDuration * 1.5) 
    const percentage = Math.min(100 *  currentProgress / estimatedDuration, maxPercentage)
    return percentage 
}

module.exports.getProgressMsg = commandId => "Running \"Terraform " + commandId + "\""

const isUnsupportedShell = terminal =>
    terminal && (
        isCmd(terminal) ||
        isWsl(terminal) ||
        terminal.creationOptions.shellPath &&
        (
            terminal.creationOptions.shellPath.toLowerCase().indexOf("git") > -1
        )
    )

const isCmd = terminal =>
    terminal && (
        terminal.name.toLowerCase().indexOf("cmd") > -1 ||
        terminal.creationOptions.shellPath &&
        (
            terminal.creationOptions.shellPath.toLowerCase().indexOf("cmd") > -1
        )
    )

const isWsl = terminal =>
    terminal && (
        terminal.name.indexOf("wsl") > -1 ||
        terminal.creationOptions.shellPath &&
        (
            terminal.creationOptions.shellPath.toLowerCase().indexOf("wsl") > -1
        )
    )

module.exports.isCmd = isCmd


module.exports.featuresDisabled = terminal => !terminal || isUnsupportedShell(terminal)

module.exports.removeColors = text => text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replaceAll("Ôöé ", "").replaceAll("ÔòÀ ", "").replaceAll("ÔòÀ", "").replaceAll("ÔòÁ", "");

module.exports.extractCWD = stdout => {
    const arr = stdout.split(" ")
    return arr[arr.length - 1].replace("\n","")
}

module.exports.getLogFileName = () => {
    const rootFolder = path.join(os.tmpdir(), rootFolderName)
	return path.join(rootFolder, "run.log")
}

module.exports.unsupportedShellNote = terminal => `For best terraform experience please use a supported shell: Powershell or Bash based terminal. Active Terminal: "${terminal.name}".`

module.exports.handleDeactivation = () => {
    const logFileName = getOSFileName()
	fs.unlink(logFileName, () => {})
	this.firstActivation = false
}

const getTextInput = (value, placeHolder = targetTxt) => vscode.window.showInputBox({
    value,
    placeHolder,
});

const getMultipleResources = async (value, placeHolder = targetTxt) => {
    
    return await vscode.window.showInputBox({
        value,
        placeHolder,
    });
}

const getVarsFile = async shellType => {
    let varFile = (await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel: 'Select tfvars file'
    }))[0].path
    if (shellType === powershellType && varFile.charAt(0)=== "/") varFile = varFile.substring(1)
    return varFile
}

module.exports.getOption = async (commandId, option, shellType) => {

    const isWithVarsFile = [tfPlanVarsCommandId, tfApplyVarsCommandId].includes(commandId)
    const isWithUpgrade  = [tfInitUpgradeCommandId].includes(commandId)
    const isWithForceUnlock = [tfForceUnlockCommandId].includes(commandId)

    if (isWithVarsFile) return await getVarsFile(shellType)
    if (isWithUpgrade) return ""
    if (isWithForceUnlock) return await getTextInput(option, "Enter Lock Id")
} 


const planSuccessful = outputFile =>
    outputFile.indexOf(planSuccessMessage1) > -1 ||
    outputFile.indexOf(planSuccessMessage2) > -1

module.exports.planSuccessful = planSuccessful

const initSuccessful = outputFile => outputFile.indexOf(initSuccessMessage) > -1

const initEmptyDir = outputFile => outputFile.indexOf(initEmptyDirMessage) > -1

const validateSuccessful = outputFile => outputFile.indexOf(validateSuccessMessage) > -1

const extractPlanTotal = outputFile => {
    const section = outputFile.split("Plan: ")
    if (section.length === 1) return 'No changes.'
    const summary = section[1].split(".")[0]+ "."
    if (summary.length > 100) return 'No changes.'
    return summary
}

module.exports.tfCommandSuccess = outputFile => {
    if (planSuccessful(outputFile)) return extractPlanTotal(outputFile)
    if (initSuccessful(outputFile)) return initSuccessMessage
    if (initEmptyDir(outputFile)) return initEmptyDirMessage
    if (validateSuccessful(outputFile)) return validateSuccessMessage
}

module.exports.getWarnings = outputFile => {
    const warningsArr = outputFile.split("Warning:")
    warningsArr.shift()
    return warningsArr.map(section => section.split("│")[0]).join(", ").replace("╷ ,","")
}

module.exports.createTextColorChanger = fileName => (document => {
    if (document.fileName === fileName) {

  // Define a regular expression to match '+'
  const plusRegExp = /\+ /g;
  const minusRegExp = /\- /g;
  const tildaRegExp = /\~ /g;

  // Define the color style
  const decorationTypeGreen = vscode.window.createTextEditorDecorationType({
    color: 'green',
  });

  const decorationTypeRed = vscode.window.createTextEditorDecorationType({
    color: 'red',
  });

  const decorationTypeYellow = vscode.window.createTextEditorDecorationType({
    color: 'yellow',
  });

  const decorationsGreen = [];
  const decorationsRed = [];
  const decorationsYellow = [];

  // Search for '+' in the text and add decorations

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    const text = line.text;
    let match;
    while ((match = plusRegExp.exec(text))) {
      const startPos = new vscode.Position(i, match.index);
      const endPos = new vscode.Position(i, match.index + 1);
      const range = new vscode.Range(startPos, endPos);
      decorationsGreen.push({ range });
    }
    while ((match = minusRegExp.exec(text))) {
        const startPos = new vscode.Position(i, match.index);
        const endPos = new vscode.Position(i, match.index + 1);
        const range = new vscode.Range(startPos, endPos);
        decorationsRed.push({ range });
      }
    while ((match = tildaRegExp.exec(text))) {
        const startPos = new vscode.Position(i, match.index);
        const endPos = new vscode.Position(i, match.index + 1);
        const range = new vscode.Range(startPos, endPos);
        decorationsYellow.push({ range  });
    }
  }

  // Apply the decorations to the editor
  setTimeout(() => {
    const editor = vscode.window.activeTextEditor;
    editor.setDecorations(decorationTypeGreen, decorationsGreen);
    editor.setDecorations(decorationTypeYellow, decorationsYellow);
    editor.setDecorations(decorationTypeRed, decorationsRed);
  }, 500)

    }
})

const targetExtension = '.tf';
const fileList = [];

module.exports.getProjectsCache = async (tfProjectsCache) => {
    if (tfProjectsCache) return tfProjectsCache
    const noOpenWorkspace = !vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders.length

    if (noOpenWorkspace) {
      // vscode.window.showErrorMessage('No workspace is opened.');
      return;
    }

    let result = []
    for (let idx in vscode.workspace.workspaceFolders){
        const projectRoot = vscode.workspace.workspaceFolders[idx].uri.fsPath
        const tfFiles = await findFilesWithExtension(projectRoot, targetExtension, fileList, projectRoot)
        result = Object.assign(result, tfFiles)
    }

    const currentTerminal = {
        name: "Active Terminal",
        current: true,
        lastModifiedTimestamp: Date.now(),
        projectPath: ".",
        path: ".",
        projectPathRelative: ".",
    }

    const projects = [currentTerminal].concat(Object.keys(result).filter(x => result[x].isProject).map(x => result[x]))
    projects.forEach(addFolderColor)
    return projects
}

module.exports.capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)


module.exports.createWebviewPanel = () => {
    const panel = vscode.window.createWebviewPanel(
        'terraformDashboard',
        'Terraform Dashboard',
        vscode.ViewColumn.One,
        { enableScripts: true,
            retainContextWhenHidden: true }
    )
    panel.onDidDispose(() => {
        panel.webview.disposed = true
      });
    return panel
    };

module.exports.isPanelOpen = projectExplorerPanel => projectExplorerPanel && (!projectExplorerPanel.q || projectExplorerPanel.q && !projectExplorerPanel.q.isDisposed)

module.exports.sortProjects = (a, b) => {
    const sameTimestamp = a.lastModifiedTimestamp === b.lastModifiedTimestamp
    if (!sameTimestamp) return a.lastModifiedTimestamp > b.lastModifiedTimestamp ? -1 : 1
    const totalA = a.resources + a.modules + a.datasources
    const totalB = b.resources + b.modules + b.datasources
    return totalA > totalB ? -1 : 1 
}

module.exports.isLegitFolder = (fileType, fileName) => {
    return fileType === vscode.FileType.Directory && fileName !== ".terraform" && fileName !== ".git"
}

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

module.exports.sendText = async (terminal, text) => {
    await terminal.sendText(text)
    await sleep(400)
}
