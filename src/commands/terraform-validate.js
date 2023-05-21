const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfValidateCommandId } = require("../shared/constants")

class TerraformValidateHandler extends ProgressHandlerPrototype {

    constructor(context, uniqueId){
        super(context, uniqueId, tfValidateCommandId );
    }
}

module.exports = { TerraformValidateHandler }