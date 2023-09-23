const { TerraformPlanHandler } = require(".")
const { tfPlanTargetCommandId } = require("../../shared/constants")

class TerraformPlanTargetHandler extends TerraformPlanHandler {

    stateList

    async executeHook() {
        const { CommandsLauncher } = require("../../launcher")
        const commandsLauncher = new CommandsLauncher(this.context, this.logger, this.stateManager)
        const { launch } = commandsLauncher
    
        let completed = false
        
        const startTime = new Date().getTime();
        const endTime = startTime + 130000; // 1 minutes in milliseconds
    
        await launch(
            "State List",
            "get-resources",
            undefined,
            () => { completed = true }
        )
        let resolve
        const interval = setInterval(() => {
            if (new Date().getTime() > endTime) completed = true
            if (completed) resolve()
        }, 200)
        
        await new Promise(_resolve => {
            resolve = _resolve
        })
        clearInterval(interval)
        this.stateList = await this.fileHandler.getStateList()
    }
    
    

    constructor(context, logger, stateManager){
        super(context, logger, stateManager, tfPlanTargetCommandId);
        // this.redirect = false
        this.addOption = true
    }
}

module.exports = { TerraformPlanTargetHandler }