const vscode = require('vscode')
const { credentialsKey } = require("./constants")
const { ChatGPTHandler } = require("../commands/chat-gpt")
const { TerraformPlanHandler } = require("../commands/plan")
const { TerraformInitHandler } = require("../commands/init")
const { TerraformStateListHandler } = require("../commands/state-list")
const { TerraformApplyHandler } = require("../commands/apply")
const { TerraformOutputHandler } = require("../commands/output")
const { OpenExplorerHandler } = require("../commands/open-explorer")
const { TerraformValidateHandler } = require("../commands/validate")
const { TerraformPlanTargetHandler } = require("../commands/plan/target")
const { TerraformPlanVarsHandler } = require("../commands/plan/vars-file")
const { TerraformApplyTargetHandler } = require("../commands/apply/target")
const { TerraformApplyVarsHandler } = require("../commands/apply/vars-file")
const { TerraformInitUpgradeHandler } = require('../commands/init/upgrade')
const { TerraformUnlockHandler } = require('../commands/unlock')

const maxLength = 40,
    topLevel = true

module.exports.getActions = stateManager => {
    const folder = stateManager.getUserFolder()
    const credentials = stateManager.getState(credentialsKey)
    const prefFolder = folder && (folder.length < maxLength ? "" : "...")
    const prefCredentials = credentials && (credentials.length < maxLength ? "" : "...")

    return [
        {
            label: 'Explorer Dashboard',
            kind: vscode.QuickPickItemKind.Separator,
            excludeExplorer: true
        },
        { handler: OpenExplorerHandler, label: "Open Explorer", icon: "$(ports-open-browser-icon)", excludeExplorer: true },
        {
            label: 'Terraform Actions',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: ChatGPTHandler, label: "ChatGPT Synopsis", icon: "$(ports-open-browser-icon)", onPlanSuccess: true,  topLevel, bType: "info"  },
        { handler: TerraformInitHandler, label: "Init", icon: "$(extensions-install-count)", topLevel, bType: "primary" },
        { handler: TerraformValidateHandler, label: "Validate", icon: "$(issue-closed)", topLevel, bType: "success" },
        { handler: TerraformOutputHandler, label: "Output", icon: "$(note)", topLevel, bType: "secondary" },
        { handler: TerraformPlanHandler, label: "Plan", icon: "$(settings-sync-view-icon)", topLevel, bType: "warning" },
        { handler: TerraformApplyHandler, label: "Apply", icon: "$(play-circle)", topLevel, bType: "danger" },
        {
            label: 'With tfVars file',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformPlanVarsHandler, label: "Plan -var-file", icon: "$(settings-sync-view-icon)"  },
        { handler: TerraformApplyVarsHandler, label: "Apply -var-file", icon: "$(play-circle)" },
        {
            label: 'Miscellaneous',
            kind: vscode.QuickPickItemKind.Separator,
            seperatorType: "weak"
        },
        { handler: TerraformInitUpgradeHandler, label: "Init -upgrade", icon: "$(cloud-download)" },
        { handler: TerraformUnlockHandler, label: "Force-unlock", icon: "$(unlock)" },
        { handler: TerraformStateListHandler, label: "State List", icon: "$(play-circle)"},
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
        // { handler: ClearStateHandler, label: "Clear preferences", icon: "$(clear-all)", menuOnly: true },
        // {
        //     handler: ChangeFolderHandler,
        //     label: folder ? 
        //         `Change Terraform Folder (${displayedFolderName})`
        //         : "Select Terraform Folder",
        //     matches: label =>
        //         label.indexOf("Change Terraform Folder") > -1 ||
        //         label.indexOf("Select Terraform Folder") > -1,
        //     icon: "$(folder-opened)",
        //     id: "tfFolder",
        //     menuOnly: true
        // },
        // {
        //     handler: CredentialsHandler,
        //     label: credentials ? 
        //         `Change Credentials (${displayedCredentials})`
        //         : "Set Credentials",
        //     icon: "$(key)",
        //     id: "tfCredentials",
        //     menuOnly: true
        // }
        
    ]
}