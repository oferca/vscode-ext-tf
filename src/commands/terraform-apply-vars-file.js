const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyVarsCommandId } = require("../shared/constants")

class TerraformApplyVarsHandler extends TerraformApplyHandler {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler, tfApplyVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyVarsHandler }