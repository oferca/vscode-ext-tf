const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfOutputCommandId } = require("../shared/constants")

class TerraformOutputHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfOutputCommandId);
        this.redirect = false
    }
}

module.exports = { TerraformOutputHandler }