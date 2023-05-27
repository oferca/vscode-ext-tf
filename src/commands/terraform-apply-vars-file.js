const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyVarsCommandId } = require("../shared/constants")

class TerraformApplyVarsHandler extends TerraformApplyHandler {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager, tfApplyVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyVarsHandler }