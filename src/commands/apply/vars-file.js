const { TerraformApplyHandler } = require(".")
const { tfApplyVarsCommandId } = require("../../shared/constants")

class TerraformApplyVarsHandler extends TerraformApplyHandler {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfApplyVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyVarsHandler }