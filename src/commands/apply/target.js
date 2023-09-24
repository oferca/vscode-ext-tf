const { TerraformApplyHandler } = require(".")
const { tfApplyTargetCommandId } = require("../../shared/constants")
const { TerraformResourceSelectorHandler } = require("../resources")


class TerraformApplyTargetHandler extends TerraformResourceSelectorHandler(TerraformApplyHandler) {

    constructor(context, logger, stateManager ){
        super(context, logger, stateManager, tfApplyTargetCommandId);
    }
}

module.exports = { TerraformApplyTargetHandler }