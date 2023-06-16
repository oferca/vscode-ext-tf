const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanVarsCommandId } = require("../shared/constants")

class TerraformPlanVarsHandler extends TerraformPlanHandler {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfPlanVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformPlanVarsHandler }