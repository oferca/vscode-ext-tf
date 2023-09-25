const vscode = require('vscode')
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

module.exports.actions = [
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
        { handler: TerraformInitHandler, label: "Init", icon: "$(extensions-install-count)", topLevel, bType: "primary", isParent: true },
        { handler: TerraformValidateHandler, label: "Validate", icon: "$(issue-closed)", topLevel, bType: "success" },
        { handler: TerraformOutputHandler, label: "Output", icon: "$(note)", topLevel, bType: "secondary" },
        { handler: TerraformPlanHandler, label: "Plan", icon: "$(settings-sync-view-icon)", topLevel, bType: "warning", isParent: true },
        { handler: TerraformApplyHandler, label: "Apply", icon: "$(play-circle)", topLevel, bType: "danger", isParent: true },
        {
            label: 'Miscellaneous',
            kind: vscode.QuickPickItemKind.Separator,
        },
        { handler: TerraformInitUpgradeHandler, label: "Init -upgrade", icon: "$(cloud-download)", parent: "Init"  },
        { handler: TerraformUnlockHandler, label: "Force-unlock", icon: "$(unlock)", misc: true },
        { handler: TerraformStateListHandler, label: "State List", icon: "$(play-circle)", misc: true },
        {
            label: 'Target Resources',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformPlanTargetHandler, label: "Plan -Target", icon: "$(settings-sync-view-icon)" , parent: "Plan" },
        { handler: TerraformApplyTargetHandler, label: "Apply -Target", icon: "$(play-circle)", parent: "Apply" },
        {
            label: 'With tfVars file',
            kind: vscode.QuickPickItemKind.Separator
        },
        { handler: TerraformPlanVarsHandler, label: "Plan -var-file", icon: "$(settings-sync-view-icon)", parent: "Plan"   },
        { handler: TerraformApplyVarsHandler, label: "Apply -var-file", icon: "$(play-circle)", parent: "Apply" },
        {
            label: 'Optional',
            kind: vscode.QuickPickItemKind.Separator,
            menuOnly: true
        }
        
    ]