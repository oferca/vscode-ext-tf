const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanVarsCommandId } = require("../shared/constants")

class TerraformPlanVarsHandler extends TerraformPlanHandler {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager, tfPlanVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformPlanVarsHandler }