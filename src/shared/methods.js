const fs = require('fs');
const os = require('os');
const path = require("path")
const vscode = require('vscode');

let db

const { 
    timeExt,
    noColorExt,
    lastRunKey,
    placeHolder,
    usedOnceKey,
    instructions,
    reminderNote,
    thankYouNote,
    tfVarsPostix,
    mainCommandId,
    rootFolderName,
    tfTargetPostix,
    tfInitCommandId,
    tfPlanCommandId,
    reminderActionText,
    initSuccessMessage,
    planSuccessMessage1,
    planSuccessMessage2,
    tfPlanVarsCommandId,
    tfValidateCommandId,
    tfApplyVarsCommandId,
    tfPlanTargetCommandId,
    tfApplyTargetCommandId,
    validateSuccessMessage,
    shellNoticeIntervalSec,
    lastShellDisclaimerKey,
    hasSupportedTerminalKey,
    dontRemindDisclaimerKey,
    intervalUsageReminderSec,
    shellNoticeIntervalHasSupportedSec
} = require("./constants")

const appRoot = path.resolve(__dirname);
const maxPercentage = 98
const setLog = async log => {
   db = db || await initFireBase()
   logOp(db, log)
}

module.exports.setLog = setLog

module.exports.extractCWD = stdout => {
    const arr = stdout.split(" ")
    return arr[arr.length - 1].replace("\n","")
}

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

module.exports.calculateAverageDuration = (dataFolder, commandId) => {
    const durations = []
    const filenames = fs.readdirSync(dataFolder + "/");

    filenames.forEach((name) => {
      const isDuration = name.indexOf("." + commandId + ".txt." + timeExt) > -1
      if (!isDuration) return

      const fullPath = path.join(dataFolder, name);
      const file = fs.readFileSync(fullPath, "utf-8");
      const decimalOnly = /\d/ . test(file)
      if (!decimalOnly) return

      const duration = parseFloat(file)
      if (duration > 3) durations.push(duration)
    });
    return median(durations)
}

const addOptionDef = (commandId, tfOption) => commandId.
    replace(tfTargetPostix, ` -${getOptionKey(commandId)}="${tfOption}" `).
    replace(tfVarsPostix, ` -${getOptionKey(commandId)}="${tfOption}" `)

const getOptionKey = commandId =>
    commandId.indexOf(tfTargetPostix) > -1 && "target" ||
    commandId.indexOf(tfVarsPostix) > -1 && "var-file"

module.exports.getOptionKey = getOptionKey

const getRawCommand = commandId => commandId.
    replace(tfTargetPostix, "").
    replace(tfVarsPostix, "")

module.exports.getRawCommand = getRawCommand

const getBashTFCommand = (commandId, tfOption) => tfOption ? `${getRawCommand(commandId)} -${getOptionKey(commandId)}="${tfOption}"` : commandId

module.exports.tfCommandBashDefinitions = (commandId, tfOption = null,redirect = true) => `
function line() {echo " --------------------------------------------------";};
finalize.${commandId}(){ 
export endVscTfPlan=$(date +%s); 
echo \`expr $endVscTfPlan - "$2"\`> "$1"${"." + timeExt + "; \ "}
${redirect ? `export tf_output=$(cat "$1.${noColorExt}";);  ` : ``}
${redirect ? `if [[ "$tf_output" == *"${successMessage(commandId)}"* ]]; then 
    echo "$(cat "$1")"; 
fi;  ` : "" }
${redirect ? `
echo; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
echo "$1.${noColorExt}"; echo; ` : ``} \
};
${getBashFunctionInvocation(commandId)}(){ 
clear; 
export startTSCommand=$(date +%s); 
echo 'Running: terraform ${tfOption ? addOptionDef(commandId, tfOption) :commandId.replaceAll("."," ") }'; echo; echo "At location:"; pwd; ${redirect ? `echo; echo "Click Hyperlink in notification for output logs."; echo;` : ""} echo "Please wait...";
terraform ${getBashTFCommand(commandId, tfOption)} ${redirect ? " > " + "$1": ""};sleep 0.1; 
finalize.${commandId} "$1" "$startTSCommand"; 
} `.replaceAll("\n", "")

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

module.exports.getProgressMsg = commandId => "Running \"Terraform " + commandId + "\" in terminal."

const logOp = async (db, rec) => {
    try{
        const { collection: fsCollection , addDoc } = require("firebase/firestore");
        var pjson = require(appRoot + '/../../package.json');
        rec.version = pjson.version;    
        const collection = fsCollection(await db, "tfh")
        try {
            await addDoc(collection, rec);
        } catch (e) {
            console.log(e)
        }
    }
    catch(e){}
    return true
}

module.exports.logOp = logOp

const isUnsupportedShell = terminal =>
    terminal.name.indexOf("pwsh") > -1 ||
    terminal.name.indexOf("cmd") > -1 ||
    terminal.name.indexOf("powershell") > -1 ||
    terminal.creationOptions.shellPath &&
     (
        terminal.creationOptions.shellPath.indexOf("pwsh") > -1 ||
        terminal.creationOptions.shellPath.indexOf("cmd") > -1 ||
        terminal.creationOptions.shellPath.toLowerCase().indexOf("powershell") > -1 ||
        terminal.creationOptions.shellPath.toLowerCase().indexOf("git") > -1
     )

const isWindows = os.platform().indexOf("win32") > -1

module.exports.featuresDisabled = terminal => !terminal || isWindows || isUnsupportedShell(terminal)

module.exports.removeColors = text => text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

module.exports.extractCWD = stdout => {
    const arr = stdout.split(" ")
    return arr[arr.length - 1].replace("\n","")
}

const getShellFileName = () => {
    const rootFolder = path.join(os.tmpdir(), rootFolderName)
	return path.join(rootFolder, "run.shell")
}

module.exports.getLogFileName = () => {
    const rootFolder = path.join(os.tmpdir(), rootFolderName)
	return path.join(rootFolder, "run.log")
}

module.exports.handleFirstActivation = async (context, cb, uniqueId) => {
    const now = new Date().getTime();
    const usedOnce = context.workspaceState.get(usedOnceKey) || false;
    const lastRunTS = context.workspaceState.get(lastRunKey) || 0
    const timeSinceLastUseSec = (now - lastRunTS) / 1000
    const shouldRemind = lastRunTS && (timeSinceLastUseSec > intervalUsageReminderSec)
    if (usedOnce && !shouldRemind) return false
    const msg = shouldRemind ? reminderNote : thankYouNote
    await vscode.window.showInformationMessage( msg, { modal: true } );
    
    setLog({
        ts: Date.now(),
        msg,
        platform: os.platform(),
        timeSinceLastUseSec,
        usedOnce,
        uniqueId
    })

    context.workspaceState.update(usedOnceKey, true);
    if (shouldRemind) context.workspaceState.update(lastRunKey, now)

    const terminal = vscode.window.createTerminal();
    terminal.show();
    terminal.sendText('echo "Define here any environment variables needed to run terraform here ";', true)
    vscode.commands.executeCommand(mainCommandId);
    cb && cb()
    vscode.window.showInformationMessage( instructions, { title: reminderActionText } );
    return true
}

const unsupportedShellNote = (termianl, hasSupported) => hasSupported ?
    `Please note that a bash shell is recommended for using this extension. Consider using your bash terminal instead of current terminal: "${termianl.name}".`
    : `Please note that a bash shell is recommended for using this extension to enable all features. Current terminal: "${termianl.name}". `

module.exports.handleShellDisclaimer = async (activeTerminal, context, uniqueId) => {
    const now = new Date().getTime();
    const hasSupportedTerminal = context.workspaceState.get(hasSupportedTerminalKey) || false
    const lastNoticeTS = context.workspaceState.get(lastShellDisclaimerKey) || 0
    const timeSinceLastNotice = (now - lastNoticeTS) / 1000
    const interval = hasSupportedTerminal ? shellNoticeIntervalHasSupportedSec : shellNoticeIntervalSec
    const timeToShowDisclaimer = timeSinceLastNotice > interval
    if (!timeToShowDisclaimer) return
    context.workspaceState.update(lastShellDisclaimerKey, now);
    const neverRemind = context.workspaceState.get(dontRemindDisclaimerKey) || false
    if (neverRemind) return
    const dontRemindStr ='Don\'t remind again'
    const msg = unsupportedShellNote(activeTerminal, hasSupportedTerminal)
    const selection = await vscode.window.showInformationMessage(
        msg,
        { title: reminderActionText },
        { title: dontRemindStr }
        );
    setLog({
        ts: now,
        msg,
        platform: os.platform(),
        selection,
        hasSupportedTerminal,
        lastNoticeTS,
        uniqueId
    })
    const timeForReDisclaimer = timeSinceLastNotice > shellNoticeIntervalSec
    if (timeForReDisclaimer) return context.workspaceState.update(dontRemindDisclaimerKey, false);
    if (selection.title === dontRemindStr) context.workspaceState.update(dontRemindDisclaimerKey, true);
}

module.exports.handleDeactivation = () => {
    const logFileName = getOSFileName()
	fs.unlink(logFileName, () => {})
	this.firstActivation = false
}

const handleActionSelect = (item, actions, uniqueId, context) => {
    const CommandHandler = actions.find(action => item === action.label).handler
    const commandHandler = new CommandHandler( context, uniqueId )
    return commandHandler.execute()
}

 const showQuickPick = async (actions, uniqueId, isFirst = false, cb = null, context) => {
    cb && cb()
    let result
    let tsBefore = 0
    let tsAfter = 0
    const labels = actions.map(action => ({
        label: (action.icon || "") + "  " + action.label,
        kind: action.kind
    }))

	while (!result && ((tsAfter - tsBefore) < 1000)){
        tsBefore = new Date().getTime()
        result = await vscode.window.showQuickPick(labels, {
            placeHolder: 'Pick a terraform command to run in terminal (\u2318\u21E7T)',
            title: "Execute Terraform Command"
        });
        tsAfter = new Date().getTime()
    }
    
    if (result) handleActionSelect(result.label.split(") ")[1].trim(), actions, uniqueId, context)
}

module.exports.showQuickPick = showQuickPick

module.exports.getOption = async (commandId, option) => {
    if (commandId === tfPlanTargetCommandId || commandId === tfApplyTargetCommandId) return await vscode.window.showInputBox({
		value: option,
		placeHolder: 'Enter module or resource to limit the operation. For example: "module.rds", or "aws_instance.my_ec2"',
	});
    if (commandId === tfPlanVarsCommandId || commandId === tfApplyVarsCommandId ) return (await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel: 'Select tfvars file'
    }))[0].path
}

const successMessage = commandId =>{
    const rawCommand = commandId.replace(tfTargetPostix, "")
    return rawCommand === tfPlanCommandId && planSuccessMessage1 ||
        rawCommand === tfPlanCommandId && planSuccessMessage2 ||
        rawCommand === tfValidateCommandId && validateSuccessMessage ||
        rawCommand === tfInitCommandId && initSuccessMessage
}

const planSuccessful = outputFile => outputFile.indexOf(planSuccessMessage1) > -1 || outputFile.indexOf(planSuccessMessage2) > -1

const initSuccessful = outputFile => outputFile.indexOf(initSuccessMessage) > -1

const validateSuccessful = outputFile => outputFile.indexOf(validateSuccessMessage) > -1

const extractPlanTotal = outputFile => {
    const section = outputFile.split("Plan: ")
    if (section.length === 1) return
    const summary = section[1].split(".")[0]
    if (summary.length > 100) return
    return summary
}

module.exports.tfCommandSuccess = outputFile => (planSuccessful(outputFile) && extractPlanTotal(outputFile))
    || (initSuccessful(outputFile) && initSuccessMessage)
    || (validateSuccessful(outputFile) && validateSuccessMessage)

module.exports.getWarnings = outputFile => {
    const warningsArr = outputFile.split("Warning:")
    warningsArr.shift()
    return warningsArr.map(section => section.split("│")[0]).join(", ").replace("╷ ,","")
}

const createButton = (text, tooltip, commandId ) => {
    const runButton = vscode.window.createStatusBarItem(1, 0)
    runButton.text = text
    runButton.tooltip = tooltip
    runButton.command = commandId
    return runButton
}

module.exports.createTerraformButton = (disposables, reminder = false) => {
    const button = createButton(`${reminder ? "$(gear~spin)" : "$(terminal)"} Terraform`, placeHolder, mainCommandId)
	button.show()
	disposables.push(button)
    return button
}

const initFireBase = async () => {
    try {
        const { initializeApp } = require("firebase/app");
        const { getFirestore } = require("firebase/firestore");
        const firebaseConfig = {
            apiKey: "AIzaSyBbqdFYxRvKPRkjoAaQjOCNc00_6f2o3Xc",
            authDomain: "terraform-progress-bar.firebaseapp.com",
            projectId: "terraform-progress-bar",
            storageBucket: "terraform-progress-bar.appspot.com",
            messagingSenderId: "664142118300",
            appId: "1:664142118300:web:7ed9790fdd1d201bed5c59",
            measurementId: "G-B74CDMSJMH"
        };
        const app = await initializeApp(firebaseConfig);
        const db = getFirestore(app);
        return db
    } catch (e) { }
}

module.exports.initFireBase = initFireBase