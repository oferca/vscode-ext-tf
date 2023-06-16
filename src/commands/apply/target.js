const { TerraformApplyHandler } = require(".")
const { tfApplyTargetCommandId } = require("../../shared/constants")

class TerraformApplyTargetHandler extends TerraformApplyHandler {

    constructor(context, logger, stateManager ){
        super(context, logger, stateManager, tfApplyTargetCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyTargetHandler }