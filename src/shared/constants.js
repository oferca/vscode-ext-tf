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

module.exports.openTerminalTxt = actionLabel => `Running "Terraform ${actionLabel}" in project root folder. To change folder cd and run again.`

module.exports.maxCompletionPercentage = 95

module.exports.maxNotificationTime = 1000 * 60 * 60 // 1hr

module.exports.defaultEstimate = 10

module.exports.rootFolderName = "vscode-tf-commands"

module.exports.thankYouNote =  "Thank you for installing Terraform Dashboard Plus. Let's start."

module.exports.reminderNote =  "Launch terraform commands with Terraform Dashboard Plus. Let's start."

module.exports.mainCommandId = "terraform.action"

module.exports.placeHolder = "Run Terraform Command ( \u2318\u21E7T or \u2303\u21E7T )"

module.exports.errorStatus = "error"

module.exports.noCredentials = "no-credentials"

module.exports.noCredentialsMsg = "Did you set credentials ?"

// module.exports.gotoTerminal = { title: 'Go To Terminal' };

module.exports.planSuccessMessage1 = "Terraform will perform"

module.exports.planSuccessMessage2 = "No changes. Your infrastructure matches the configuration"

module.exports.initSuccessMessage = "Terraform has been successfully initialized"

module.exports.initEmptyDirMessage = "Terraform initialized in an empty directory."

module.exports.validateSuccessMessage = "The configuration is valid"

module.exports.runLogFileName = "run.log"

module.exports.powershellType = "powershell"

module.exports.bashType = "bash"

module.exports.lastShellDisclaimerKey = "tfLastUnsupportedShellDisclaimer"

module.exports.shellNoticeIntervalSec = 60 * 60 * 24 * 45

module.exports.shellNoticeIntervalHasSupportedSec = 60 * 60 * 24

module.exports.hasSupportedTerminalKey = "tfHasSupportedTerminal"

module.exports.dontRemindDisclaimerKey = "tfNeverRemindDisclaimer"

module.exports.welcomeNotifiedKey = "tfFirstUse"

module.exports.lastRunKey = "tfLastExec"

module.exports.optionKey = "tfOption"

module.exports.runCountKey = "tfRunCount"

module.exports.lastTerminalNoticeKey = "tfLastTerminalNotice"

module.exports.instructions = "Thank you for installing Terraform Dashboard Plus. Expand \"TERRAFORM\" panel for dashboard."

module.exports.reminder = "Click \"> TERRAFORM\" panel to run commands."

module.exports.instructionsEnvVar = "Define needed environment variables (e.g AWS_ACCESS... ) in terminal normally."

module.exports.tryItText = "Got It"

module.exports.intervalUsageReminderSec = 60 * 60 * 24 * 21

module.exports.isWindows = os.platform().indexOf("win32") > -1

module.exports.targetTxt = 'Enter module or resource to limit the operation. For example: "module.rds", or "aws_instance.my_ec2"'

module.exports.changeFolderKey = "tfChangeFolderKey"

module.exports.credentialsKey = "tfCredentialsKey"

module.exports.stationIdKey = "tfStationId"

module.exports.dashboardExpendedOnceKey = "tfFirstDashboardExpand"

module.exports.preferencesSetText = "[ Preferences Selected ] Pick a command to run."

module.exports.pickACommandText = "Pick a terraform command to run in terminal"

module.exports.chatGPTQueryText = "Please summarize the following terraform plan output:\n"

module.exports.chatGPTPromptText = "Copied to clipboard. PLEASE PASTE in ChatGPT(⌘v)"

module.exports.emptyPlanTxt = "No plan output found. Please run \"Plan\" and try again."

module.exports.lastActionKey = "tfPreviousAction"

module.exports.lastOutputKey = "tfPreviousOutput"

module.exports.warningToken = "Warning:"

module.exports.errorToken = "Error:"

module.exports.titleToken = "  # "

module.exports.planToken = "Plan:"

module.exports.forcesReplacementToken = "forces"

module.exports.chatGPTFirstLine = "Please summarize and explain the following terraform plan output: "