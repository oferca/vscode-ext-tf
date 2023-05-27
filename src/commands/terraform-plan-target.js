const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanTargetCommandId } = require("../shared/constants")

class TerraformPlanTargetHandler extends TerraformPlanHandler {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler, tfPlanTargetCommandId);
        this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformPlanTargetHandler }