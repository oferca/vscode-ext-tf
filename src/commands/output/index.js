const { CommandHandlerPrototype } = require("../base")
const { tfOutputCommandId } = require("../../shared/constants")

class TerraformOutputHandler extends CommandHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfOutputCommandId);
        this.redirect = false
    }
}

module.exports = { TerraformOutputHandler }