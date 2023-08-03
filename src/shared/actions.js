const vscode = require('vscode')
const { credentialsKey } = require("./constants")
const { ChatGPTHandler } = require("../commands/chat-gpt")
const { ClearStateHandler } = require("../commands/clear")
const { TerraformPlanHandler } = require("../commands/plan")
const { TerraformInitHandler } = require("../commands/init")
const { TerraformApplyHandler } = require("../commands/apply")
const { TerraformOutputHandler } = require("../commands/output")
const { CredentialsHandler } = require("../commands/credentials")
const { TerraformValidateHandler } = require("../commands/validate")
const { ChangeFolderHandler } = require("../commands/change-folder")
const { TerraformPlanTargetHandler } = require("../commands/plan/target")
const { TerraformPlanVarsHandler } = require("../commands/plan/vars-file")
const { TerraformApplyTargetHandler } = require("../commands/apply/target")
const { TerraformApplyVarsHandler } = require("../commands/apply/vars-file")

const maxLength = 40

module.exports.getActions = stateManager => {
    const folder = stateManager.getUserFolder()
    const credentials = stateManager.getState(credentialsKey)
    const prefFolder = folder && (folder.length < maxLength ? "" : "...")
    const prefCredentials = credentials && (credentials.length < maxLength ? "" : "...")
    const displayedFolderName = folder ? (prefFolder + folder.substring(folder.length - maxLength)) : null
    const displayedCredentials = credentials ? (prefCredentials + credentials.substring(credentials.length - maxLength)) : null

    return [
        {
            label: 'Plan Synopsis',
            kind: vscode.QuickPickItemKind.Separator,
            menuOnly: true
        },
        { handler: ChatGPTHandler, label: "ChatGPT Synopsis", icon: "$(ports-open-browser-icon)", menuOnly: true },
        {
            label: 'Terraform Commands',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformInitHandler, label: "Init", icon: "$(extensions-install-count)" },
        { handler: TerraformValidateHandler, label: "Validate", icon: "$(issue-closed)"  },
        { handler: TerraformOutputHandler, label: "Output", icon: "$(note)"  },
        { handler: TerraformPlanHandler, label: "Plan", icon: "$(settings-sync-view-icon)"  },
        { handler: TerraformApplyHandler, label: "Apply", icon: "$(play-circle)"  },
        {
            label: 'With tfVars file',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformPlanVarsHandler, label: "Plan -var-file", icon: "$(settings-sync-view-icon)"  },
        { handler: TerraformApplyVarsHandler, label: "Apply -var-file", icon: "$(play-circle)" },
        {
            label: 'Target Resources',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformPlanTargetHandler, label: "Plan -Target", icon: "$(settings-sync-view-icon)"  },
        { handler: TerraformApplyTargetHandler, label: "Apply -Target", icon: "$(play-circle)" },
        {
            label: 'Optional',
            kind: vscode.QuickPickItemKind.Separator,
            menuOnly: true
        },
        { handler: ClearStateHandler, label: "Clear preferences", icon: "$(clear-all)", menuOnly: true },
        {
            handler: ChangeFolderHandler,
            label: folder ? 
                `Change Terraform Folder (${displayedFolderName})`
                : "Select Terraform Folder",
            matches: label =>
                label.indexOf("Change Terraform Folder") > -1 ||
                label.indexOf("Select Terraform Folder") > -1,
            icon: "$(folder-opened)",
            id: "tfFolder",
            menuOnly: true
        },
        {
            handler: CredentialsHandler,
            label: credentials ? 
                `Change Credentials (${displayedCredentials})`
                : "Set Credentials",
            icon: "$(key)",
            id: "tfCredentials",
            menuOnly: true
        },
    ]
}