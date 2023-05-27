const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfValidateCommandId } = require("../shared/constants")

class TerraformValidateHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler, tfValidateCommandId );
    }
}

module.exports = { TerraformValidateHandler }