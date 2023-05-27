const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfOutputCommandId } = require("../shared/constants")

class TerraformOutputHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager, shellHandler){
        super(context, logger, lifecycleManager, shellHandler, tfOutputCommandId);
        this.redirect = false
    }
}

module.exports = { TerraformOutputHandler }