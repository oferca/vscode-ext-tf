const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfValidateCommandId } = require("../shared/constants")

class TerraformValidateHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager, tfValidateCommandId );
    }
}

module.exports = { TerraformValidateHandler }