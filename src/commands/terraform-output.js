const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfOutputCommandId } = require("../shared/constants")

class TerraformOutputHandler extends ProgressHandlerPrototype {

    constructor(context, uniqueId){
        super(context, uniqueId, tfOutputCommandId);
        this.redirect = false
    }
}

module.exports = { TerraformOutputHandler }