const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanVarsCommandId } = require("../shared/constants")

class TerraformPlanVarsHandler extends TerraformPlanHandler {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler, tfPlanVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformPlanVarsHandler }