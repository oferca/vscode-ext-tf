const { ProgressHandlerPrototype } = require("../base/progress")
const { tfApplyCommandId, tfPlanCommandId } = require("../../shared/constants")

class TerraformApplyHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager, cmdId){
        super(context, logger, stateManager, cmdId || tfApplyCommandId);
        this.redirect = false
        this.averageFromCmd = tfPlanCommandId
    }
}

module.exports = { TerraformApplyHandler }