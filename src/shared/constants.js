const os = require('os');

const tfplanCommandName = 'vscode-ext-tf.tfcommand'

const inspectCommandName = 'vscode-ext-tf.inspect.tfplan'

module.exports.tfplanCommandName = tfplanCommandName

module.exports.inspectCmdId = inspectCommandName

const timeExt = "time"

module.exports.timeExt = timeExt

const noColorExt = "no-color"

module.exports.noColorExt = noColorExt

module.exports.tfPlanCommandId = "plan"

const tfTargetPostix = ".target"

module.exports.tfTargetPostix = tfTargetPostix

const tfVarsPostix = ".var.file"

module.exports.tfVarsPostix = tfVarsPostix

module.exports.tfPlanTargetCommandId = "plan" + tfTargetPostix

module.exports.tfPlanVarsCommandId = "plan" + tfVarsPostix

module.exports.tfApplyTargetCommandId = "apply" + tfTargetPostix

module.exports.tfApplyVarsCommandId = "apply" + tfVarsPostix

module.exports.tfInitCommandId = "init"

module.exports.tfValidateCommandId = "validate"

module.exports.tfOutputCommandId = "output"

module.exports.tfApplyCommandId = "apply"

module.exports.newLine = '\\n' 

module.exports.supportedShellText = "Please use a bash based shell. Poweshell and git bash shells are not currently supported."

module.exports.supportedShellTextWindows = "Please use a bash based shell such as WSL. Poweshell, cmd and Git shells are not currently supported."

module.exports.openTerminalTxt = "To run command, please open a bash terminal and change to a folder with terraform modules."

module.exports.maxCompletionPercentage = 95

module.exports.maxNotificationTime = 1000 * 60 * 60 // 1hr

module.exports.defaultEstimate = 10

module.exports.rootFolderName = "vscode-tf-commands"

module.exports.thankYouNote =  "Thank you for installing Advanced Terraform Shortcuts. Let's start your new terraform experience."

module.exports.reminderNote =  "You may use Advanced Terraform Shortcuts to run terraform commands. Let's start."

module.exports.mainCommandId = "terraform.action"

module.exports.placeHolder = "Run Terraform Command ( \u2318\u21E7T or \u2303\u21E7T )"

module.exports.errorStatus = "error"

module.exports.gotoTerminal = { title: 'Go To Terminal' };

module.exports.planSuccessMessage1 = "Terraform will perform"

module.exports.planSuccessMessage2 = "No changes. Your infrastructure matches the configuration"

module.exports.initSuccessMessage = "Terraform has been successfully initialized"

module.exports.validateSuccessMessage = "The configuration is valid"

module.exports.runLogFileName = "run.log"

module.exports.powershellType = "powershell"

module.exports.bashType = "bash"

module.exports.lastShellDisclaimerKey = "tfLastUnsupportedShellDisclaimer"

module.exports.shellNoticeIntervalSec = 60 * 60 * 24 * 45

module.exports.shellNoticeIntervalHasSupportedSec = 60 * 60 * 24

module.exports.hasSupportedTerminalKey = "tfHasSupportedTerminal"

module.exports.dontRemindDisclaimerKey = "tfNeverRemindDisclaimer"

module.exports.usedOnceKey = "tfUsedFirstTime"

module.exports.lastRunKey = "tfLastExec"

module.exports.lastTerminalNoticeKey = "tfLastTerminalNotice"

module.exports.instructions = "This is a quick launcher menu. Open with \"Terraform\" button in status bar or shortcuts: \"\u2318\u21E7T\" or \"\u2303\u21E7T\" (Cmd/Ctrl + Shift + T)"

module.exports.instructionsEnvVar = "Define needed environment variables (e.g AWS_ACCESS... ) in terminal normally."

module.exports.reminderActionText = "Got it"

module.exports.intervalUsageReminderSec = 60 * 60 * 24 * 21

module.exports.isWindows = os.platform().indexOf("win32") > -1

