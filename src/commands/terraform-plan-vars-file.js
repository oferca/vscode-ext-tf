const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanVarsCommandId } = require("../shared/constants")

class TerraformPlanVarsHandler extends TerraformPlanHandler {

    constructor(context, uniqueId){
        super(context, uniqueId, tfPlanVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformPlanVarsHandler }