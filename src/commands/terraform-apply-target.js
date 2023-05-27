const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyTargetCommandId } = require("../shared/constants")

class TerraformApplyTargetHandler extends TerraformApplyHandler {

    constructor(context, lifecycleManager, logger){
        super(context, logger, lifecycleManager, tfApplyTargetCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyTargetHandler }