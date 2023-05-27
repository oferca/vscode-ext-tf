const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfInitCommandId } = require("../shared/constants")

class TerraformInitHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler , tfInitCommandId);
    }
}

module.exports = { TerraformInitHandler }