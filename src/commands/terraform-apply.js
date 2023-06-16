const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfApplyCommandId, tfPlanCommandId } = require("../shared/constants")

class TerraformApplyHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager, cmdId){
        super(context, logger, stateManager, cmdId || tfApplyCommandId);
        this.redirect = false
        this.averageFromCmd = tfPlanCommandId
    }
}

module.exports = { TerraformApplyHandler }