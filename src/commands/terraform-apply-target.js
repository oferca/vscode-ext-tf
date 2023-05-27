const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyTargetCommandId } = require("../shared/constants")

class TerraformApplyTargetHandler extends TerraformApplyHandler {

    constructor(context, lifecycleManager, shellHandler, logger){
        super(context, logger, lifecycleManager, shellHandler, tfApplyTargetCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyTargetHandler }