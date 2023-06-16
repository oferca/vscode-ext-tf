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
const folderNameMaxLength = 40

module.exports.getActions = stateManager => {
    const pref = stateManager.selectedFolder && stateManager.selectedFolder.length < folderNameMaxLength ? "" : "..."
    const displayedFolderName = pref + stateManager.selectedFolder.substring(stateManager.selectedFolder.length - folderNameMaxLength)
    return [
        {
            label: 'Optional',
            kind: vscode.QuickPickItemKind.Separator
        },
        {
            handler: ChangeFolderHandler,
            label: stateManager.selectedFolder ? 
                `Change Terraform Folder (${displayedFolderName})`
                : "Select Terraform Folder",
            icon: "$(folder-opened)"
        },
        {
            label: 'Common',
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