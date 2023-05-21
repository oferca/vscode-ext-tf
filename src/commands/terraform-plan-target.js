const { TerraformPlanHandler } = require("./terraform-plan")
const { tfPlanTargetCommandId } = require("../shared/constants")

class TerraformPlanTargetHandler extends TerraformPlanHandler {

    constructor(context, uniqueId){
        super(context, uniqueId, tfPlanTargetCommandId);
        this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformPlanTargetHandler }