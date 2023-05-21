const vscode = require('vscode');
const { ProgressHandlerPrototype } = require("./progress-prototype")
const { tfPlanCommandId } = require("../shared/constants")

class TerraformPlanHandler extends ProgressHandlerPrototype {

    constructor(context, uniqueId, cmdId){
        super(context, uniqueId, cmdId || tfPlanCommandId);
    }
}

module.exports = { TerraformPlanHandler }