const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyTargetCommandId } = require("../shared/constants")

class TerraformApplyTargetHandler extends TerraformApplyHandler {

    constructor(context, uniqueId){
        super(context, uniqueId, tfApplyTargetCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyTargetHandler }