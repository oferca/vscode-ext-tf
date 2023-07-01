const { ProgressHandlerPrototype } = require("../base/progress")
const { tfValidateCommandId } = require("../../shared/constants")

class TerraformValidateHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfValidateCommandId );
        // this.requiresInitialization = false
    }
}

module.exports = { TerraformValidateHandler }