const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfValidateCommandId } = require("../shared/constants")

class TerraformValidateHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfValidateCommandId );
    }
}

module.exports = { TerraformValidateHandler }