const { TerraformPlanHandler } = require(".")
const { tfPlanNoLockCommandId } = require("../../shared/constants")

class TerraformPlanNoLockHandler extends TerraformPlanHandler {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfPlanNoLockCommandId);
    }
}

module.exports = { TerraformPlanNoLockHandler }