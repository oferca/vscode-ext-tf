const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfOutputCommandId } = require("../shared/constants")

class TerraformOutputHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager){
        super(context, logger, lifecycleManager, tfOutputCommandId);
        this.redirect = false
    }
}

module.exports = { TerraformOutputHandler }