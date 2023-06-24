const { ProgressHandlerPrototype } = require("../base/progress")
const { tfInitCommandId } = require("../../shared/constants")

class TerraformInitHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfInitCommandId);
        this.requiresInitialization = false
    }
}

module.exports = { TerraformInitHandler }