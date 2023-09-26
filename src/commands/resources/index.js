const vscode = require('vscode');
const { getRawCommand } = require("../../shared/methods")
const { tfResourcesSelectionKey, lastSelectedProjectPathKey} = require("../../shared/constants")

module.exports = { TerraformResourceSelectorHandler: superclass => class extends superclass { 
    multipleTargetSelection

    async executeHook() {
        const stateList = await this.refreshTargets()
        if (!stateList) return
        let tsAfter = 0
        let tsBefore = 0
        let showMenuAttempts = 0
        let selectionDurationMS = 0
        let targets = []
        const trResourcesKey = tfResourcesSelectionKey + this.stateManager.getState(lastSelectedProjectPathKey)
        const prevTargets = (this.stateManager.getState(trResourcesKey) || "").split(",")

        while (!(targets || []).length && (selectionDurationMS < 3000) && showMenuAttempts < 8){
            tsBefore = new Date().getTime()
            const resources = 
                stateList.content
                .split("\n")
                .map(resource => resource.replaceAll("\n", "").replaceAll("\r", ""))
                .map(resource => ({
                    label: resource,
                    picked: prevTargets.find(target => target === resource)
                }))
            if (!resources || resources.length < 2) return this.abort()
            targets = await vscode.window.showQuickPick(resources,
              {
                canPickMany: true, // Enable multiple selections
                placeHolder: `Select one or more targets for "terraform ${getRawCommand(this.commandId)}.`
              })
            tsAfter = new Date().getTime()
            selectionDurationMS = tsAfter - tsBefore
            showMenuAttempts++
        }
        if (!targets || !targets.length) return this.abort()
        this.stateManager.updateState(trResourcesKey, targets.map(target => target.label).join(","))
    }
    
  
    async refreshTargets() {
        const { CommandsLauncher } = require("../../launcher")
        const commandsLauncher = new CommandsLauncher(this.context, this.logger, this.stateManager)
        const { launch } = commandsLauncher
    
        const startTime = new Date().getTime();
        const endTime = startTime + 60000; // 1 minutes in milliseconds
    
        await launch(
            "State List",
            "target-resources-command",
            undefined,
            () => {}
        )
        let resolve
        let tooLong
        let stateList
        let newStateFile = false
        let initialNumFiles = 0
        if (!this.fileHandler) this.initFileHandler()
        const interval = setInterval(() => {
            const tooLong =  (new Date().getTime() > endTime)
            if (tooLong) resolve()
            stateList = this.fileHandler.getStateList()
            if (!stateList) return
            newStateFile = newStateFile || (stateList.total > initialNumFiles)
            initialNumFiles = stateList.total
            const newContent = newStateFile && stateList.content.length > 10
            if (newContent) resolve()
        }, 500)
        
        await new Promise(_resolve => {
            resolve = _resolve
        })
        clearInterval(interval)
        if (tooLong) return

        return stateList
    }
    constructor(context, logger, stateManager, tfCommandId){
        super(context, logger, stateManager, tfCommandId);
        this.addOption = true
        this.multipleTargetSelection = true
    }
} }
