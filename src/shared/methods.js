const fs = require('fs');
const os = require('os');
const path = require("path")
const vscode = require('vscode');
let db

const { 
    timeExt,
    targetTxt,
    tfVarsPostix,
    rootFolderName,
    tfTargetPostix,
    credentialsKey,
    powershellType,
    initSuccessMessage,
    initEmptyDirMessage,
    planSuccessMessage1,
    planSuccessMessage2,
    tfPlanVarsCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId,
    validateSuccessMessage,
} = require("./constants")

const { findFilesWithExtension } = require("../view/main/helpers")

const maxPercentage = 98

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

const getOptionKey = commandId =>
    commandId.indexOf(tfTargetPostix) > -1 && "target" ||
    commandId.indexOf(tfVarsPostix) > -1 && "var-file"

module.exports.getOptionKey = getOptionKey

const getRawCommand = commandId => commandId.
    replace(tfTargetPostix, "").
    replace(tfVarsPostix, "")

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

const addOptionDef = (commandId, tfOption) => commandId.
    replace(tfTargetPostix, ` -${getOptionKey(commandId)}="${tfOption}" `).
    replace(tfVarsPostix, ` -${getOptionKey(commandId)}="${tfOption}" `)

module.exports.addOptionDef = addOptionDef

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

module.exports.unsupportedShellNote = terminal => `For best terraform experience please use a supported shell: Powershell or Bash based terminal. Current terminal: "${terminal.name}".`

module.exports.handleDeactivation = () => {
    const logFileName = getOSFileName()
	fs.unlink(logFileName, () => {})
	this.firstActivation = false
}

const getTargetResource = value => vscode.window.showInputBox({
    value,
    placeHolder: targetTxt,
});

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
    const isWithTarget = [tfPlanTargetCommandId, tfApplyTargetCommandId].includes(commandId)
    const isWithVarsFile = [tfPlanVarsCommandId, tfApplyVarsCommandId].includes(commandId)

    if (isWithTarget) return await getTargetResource(option)
    if (isWithVarsFile) return await getVarsFile(shellType)
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
    if (section.length === 1) return
    const summary = section[1].split(".")[0]+ "."
    if (summary.length > 100) return
    return summary
}

module.exports.tfCommandSuccess = outputFile => (planSuccessful(outputFile) && extractPlanTotal(outputFile))
    || (initSuccessful(outputFile) && initSuccessMessage)
    || (initEmptyDir(outputFile) && initEmptyDirMessage)
    || (validateSuccessful(outputFile) && validateSuccessMessage)

module.exports.getWarnings = outputFile => {
    const warningsArr = outputFile.split("Warning:")
    warningsArr.shift()
    return warningsArr.map(section => section.split("│")[0]).join(", ").replace("╷ ,","")
}

module.exports.removeLastInstance = (badtext, str) => {
    var charpos = str.lastIndexOf(badtext);
    if (charpos<0) return str;
    ptone = str.substring(0,charpos);
    pttwo = str.substring(charpos+(badtext.length));
    return (ptone+pttwo);
}

module.exports.createFolderCollapser = (fileName, listener, fileHandler) => (document => {
    if (document.fileName === fileName) {
        const folder = vscode.workspace.workspaceFolders[0];
        const uri = vscode.Uri.file(folder.uri.fsPath + "/.terraform");
        vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders', uri);
        listener && listener.dispose()
    }
})


const targetExtension = '.tf';
const fileList = [];

module.exports.getProjectsCache = async (tfProjectsCache) => {
    if (tfProjectsCache) return tfProjectsCache

    const workspacePath = vscode.workspace.rootPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage('No workspace is opened.');
      return;
    }
    const tfFiles = await findFilesWithExtension(workspacePath, targetExtension, fileList)
    return Object.keys(tfFiles).filter(x => tfFiles[x].isProject).map(x => tfFiles[x]) 
}

module.exports.capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

module.exports.getNamespacedCredentialsKey = projectPath => credentialsKey + "_" + projectPath

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
    if (!sameTimestamp) return a.lastModifiedTimestamp > b.lastModifiedTimestamp ? 1 : -1
    const totalA = a.resources + a.modules + a.datasources
    const totalB = b.resources + b.modules + b.datasources
    return totalA > totalB ? 1 : -1 
}

module.exports.isLegitFolder = (fileType, fileName) => {
    return fileType === vscode.FileType.Directory && fileName !== ".terraform" && fileName !== ".git"
}

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

module.exports.sendText = async (terminal, text) => {
    await terminal.sendText(text)
    await sleep(400)
}
