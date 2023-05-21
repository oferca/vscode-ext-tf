const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfInitCommandId } = require("../shared/constants")

class TerraformInitHandler extends ProgressHandlerPrototype {

    constructor(context, uniqueId){
        super(context, uniqueId, tfInitCommandId);
    }
}

module.exports = { TerraformInitHandler }