const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfApplyCommandId, tfPlanCommandId } = require("../shared/constants")

class TerraformApplyHandler extends ProgressHandlerPrototype {

    constructor(context, uniqueId, cmdId){
        super(context, uniqueId, cmdId || tfApplyCommandId);
        this.redirect = false
        this.averageFromCmd = tfPlanCommandId
    }
}

module.exports = { TerraformApplyHandler }