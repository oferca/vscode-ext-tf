const vscode = require('vscode');
const { TerraformPlanHandler } = require("../commands/terraform-plan")
const { TerraformInitHandler } = require("../commands/init")
const { TerraformApplyHandler } = require("../commands/terraform-apply")
const { TerraformValidateHandler } = require("../commands/validate")
const { TerraformOutputHandler } = require("../commands/output")
const { TerraformPlanTargetHandler } = require("../commands/plan/target")
const { TerraformApplyTargetHandler } = require("../commands/apply/target")
const { TerraformPlanVarsHandler } = require("../commands/terraform-plan-vars-file")
const { TerraformApplyVarsHandler } = require("../commands/terraform-apply-vars-file")

module.exports.actions = [
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