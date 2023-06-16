const { TerraformPlanHandler } = require(".")
const { tfPlanTargetCommandId } = require("../../shared/constants")

class TerraformPlanTargetHandler extends TerraformPlanHandler {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfPlanTargetCommandId);
        this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformPlanTargetHandler }