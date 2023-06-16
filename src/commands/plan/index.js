const { ProgressHandlerPrototype } = require("../base/progress")
const { tfPlanVarsCommandId } = require("../../shared/constants")

class TerraformPlanHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager, cmdId){
        super(context, logger, stateManager, cmdId || tfPlanCommandId);
    }
}

module.exports = { TerraformPlanHandler }