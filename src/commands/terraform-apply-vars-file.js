const { TerraformApplyHandler } = require("./terraform-apply")
const { tfApplyVarsCommandId } = require("../shared/constants")

class TerraformApplyVarsHandler extends TerraformApplyHandler {

    constructor(context, uniqueId){
        super(context, uniqueId, tfApplyVarsCommandId);
        this.addOption = true
    }
}

module.exports = { TerraformApplyVarsHandler }