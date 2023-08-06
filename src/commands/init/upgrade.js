const { ProgressHandlerPrototype } = require("../base/progress")
const { tfInitCommandId, tfInitUpgradeCommandId } = require("../../shared/constants")

class TerraformInitUpgradeHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfInitUpgradeCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformInitUpgradeHandler }