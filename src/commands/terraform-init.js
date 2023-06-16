const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfInitCommandId } = require("../shared/constants")

class TerraformInitHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfInitCommandId);
    }
}

module.exports = { TerraformInitHandler }