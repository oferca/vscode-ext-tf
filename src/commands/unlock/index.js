const { tfForceUnlockCommandId } = require("../../shared/constants");
const { CommandHandlerPrototype } = require("../base");

class TerraformUnlockHandler extends CommandHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfForceUnlockCommandId);
        this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformUnlockHandler }