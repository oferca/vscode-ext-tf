const { CommandHandlerPrototype } = require("../base")
const { tfStateListCommandId } = require("../../shared/constants")

class TerraformStateListHandler extends CommandHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfStateListCommandId);
    }
}

module.exports = { TerraformStateListHandler }