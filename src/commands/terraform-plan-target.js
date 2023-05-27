const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanTargetCommandId } = require("../shared/constants")

class TerraformPlanTargetHandler extends TerraformPlanHandler {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager, tfPlanTargetCommandId);
        this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformPlanTargetHandler }