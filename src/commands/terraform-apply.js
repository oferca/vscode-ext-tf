const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfApplyCommandId, tfPlanCommandId } = require("../shared/constants")

class TerraformApplyHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManagerr, cmdId){
        super(context, logger, lifecycleManager, cmdId || tfApplyCommandId);
        this.redirect = false
        this.averageFromCmd = tfPlanCommandId
    }
}

module.exports = { TerraformApplyHandler }