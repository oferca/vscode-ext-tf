const { CommandHandlerPrototype } = require("../base")
const { tfStateListCommandId } = require("../../shared/constants")

class TerraformStateListHandler extends CommandHandlerPrototype {
    async executeHook(source) {
        if (source === "target-resources-command") this.sendConsoleOutput = false
    }
    constructor(context, logger, stateManager){
        super(context, logger, stateManager , tfStateListCommandId);
    }
}

module.exports = { TerraformStateListHandler }