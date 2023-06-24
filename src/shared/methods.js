const fs = require('fs');
const os = require('os');
const path = require("path")
const vscode = require('vscode');

let db

const { 
    timeExt,
    isWindows,
    targetTxt,
    tfVarsPostix,
    rootFolderName,
    tfTargetPostix,
    powershellType,
    tfInitCommandId,
    tfPlanCommandId,
    initSuccessMessage,
    initEmptyDirMessage,
    planSuccessMessage1,
    planSuccessMessage2,
    tfPlanVarsCommandId,
    tfValidateCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId,
    validateSuccessMessage,
} = require("./constants")

const maxPercentage = 98

module.exports.openOutputFile = commandHandler => {
    vscode.workspace.openTextDocument(commandHandler.outputFile).then(doc => {
        vscode.window.showTextDocument(doc); 
    })
}

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

const getBashTFCommand = (commandId, tfOption) => tfOption ? `${getRawCommand(commandId)} -${getOptionKey(commandId)}="${tfOption}"` : commandId

module.exports.getBashTFCommand = getBashTFCommand

const getBashFunctionInvocation = cmdId => "terraform." + cmdId

module.exports.getBashFunctionInvocation = getBashFunctionInvocation

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

const isPowershell = terminal =>
    terminal && (
        terminal.name === '' && !terminal.creationOptions.shellPath && isWindows ||
        terminal.name.toLowerCase().indexOf("pwsh") > -1 ||
        terminal.name.toLowerCase().indexOf("powershell") > -1 ||
        terminal.creationOptions.shellPath &&
        (
            terminal.creationOptions.shellPath.toLowerCase().indexOf("pwsh") > -1 ||
            terminal.creationOptions.shellPath.toLowerCase().indexOf("powershell") > -1
        )
    )
module.exports.isPowershell = isPowershell

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

const successMessage = commandId =>{
    const rawCommand = commandId.replace(tfTargetPostix, "")
    return rawCommand === tfPlanCommandId && planSuccessMessage1 ||
        rawCommand === tfPlanCommandId && planSuccessMessage2 ||
        rawCommand === tfValidateCommandId && validateSuccessMessage ||
        rawCommand === tfInitCommandId && initSuccessMessage
}

module.exports.successMessage = successMessage

const planSuccessful = outputFile => outputFile.indexOf(planSuccessMessage1) > -1 || outputFile.indexOf(planSuccessMessage2) > -1

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
        listener.dispose()
        
    }
})

