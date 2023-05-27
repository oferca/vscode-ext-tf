const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfInitCommandId } = require("../shared/constants")

class TerraformInitHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager , tfInitCommandId);
    }
}

module.exports = { TerraformInitHandler }