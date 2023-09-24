const vscode = require('vscode');
const { TerraformPlanHandler } = require(".")
const { TerraformResourceSelectorHandler } = require("../resources")
const { tfPlanTargetCommandId } = require("../../shared/constants")

class TerraformPlanTargetHandler extends TerraformResourceSelectorHandler(TerraformPlanHandler) {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfPlanTargetCommandId);
    }
}

module.exports = { TerraformPlanTargetHandler }