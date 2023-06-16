const vscode = require('vscode');
const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfPlanCommandId } = require("../shared/constants")

class TerraformPlanHandler extends ProgressHandlerPrototype {

    constructor(context, logger, stateManager, cmdId){
        super(context, logger, stateManager, cmdId || tfPlanCommandId);
    }
}

module.exports = { TerraformPlanHandler }