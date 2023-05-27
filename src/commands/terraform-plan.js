const vscode = require('vscode');
const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfPlanCommandId } = require("../shared/constants")

class TerraformPlanHandler extends ProgressHandlerPrototype {

    constructor(context, logger, lifecycleManager, shellHandler, cmdId){
        super(context, logger, lifecycleManager, shellHandler, cmdId || tfPlanCommandId);
    }
}

module.exports = { TerraformPlanHandler }