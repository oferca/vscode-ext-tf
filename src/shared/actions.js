const vscode = require('vscode');
const { TerraformPlanHandler } = require("../commands/plan")
const { TerraformInitHandler } = require("../commands/init")
const { TerraformApplyHandler } = require("../commands/apply")
const { TerraformValidateHandler } = require("../commands/validate")
const { TerraformOutputHandler } = require("../commands/output")
const { TerraformPlanTargetHandler } = require("../commands/plan/target")
const { TerraformApplyTargetHandler } = require("../commands/apply/target")
const { TerraformPlanVarsHandler } = require("../commands/plan/vars-file")
const { TerraformApplyVarsHandler } = require("../commands/apply/vars-file")
const { ChangeFolderHandler } = require("../commands/change-folder")
const { CredentialsHandler } = require("../commands/credentials")
const { ClearStateHandler } = require("../commands/clear")
const { credentialsKey } = require("./constants")

const maxLength = 40

module.exports.getActions = stateManager => {
    const folder = stateManager.getUserFolder()
    const credentials = stateManager.credentials || stateManager.getState(credentialsKey)
    const prefFolder = folder && (folder.length < maxLength ? "" : "...")
    const prefCredentials = credentials && (credentials.length < maxLength ? "" : "...")
    const displayedFolderName = folder ? (prefFolder + folder.substring(folder.length - maxLength)) : null
    const displayedCredentials = credentials ? (prefCredentials + credentials.substring(credentials.length - maxLength)) : null
    return [
        {
            label: 'Optional',
            kind: vscode.QuickPickItemKind.Separator,
            optional: true
        },
        { handler: ClearStateHandler, label: "Clear preferences", icon: "$(clear-all)", optional: true },
        {
            handler: ChangeFolderHandler,
            label: folder ? 
                `Change Terraform Folder (${displayedFolderName})`
                : "Select Terraform Folder",
            matches: label => label.indexOf("Change Terraform Folder") > -1 || label.indexOf("Select Terraform Folder") > -1,
            icon: "$(folder-opened)",
            id: "tfFolder",
            optional: true
        },
        {
            handler: CredentialsHandler,
            label: credentials ? 
                `Change Credentials (${displayedCredentials})`
                : "Set Credentials",
            icon: "$(key)",
            id: "tfCredentials",
            optional: true
        },
        {
            label: 'Terraform Command',
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
        { handler: TerraformApplyTargetHandler, label: "Apply -Target", icon: "$(play-circle)" }
    ]
}