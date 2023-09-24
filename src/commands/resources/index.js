const vscode = require('vscode');

module.exports = { TerraformResourceSelectorHandler: superclass => class extends superclass { 
    targets
    multipleTargetSelection

    async executeHook() {
        const { CommandsLauncher } = require("../../launcher")
        const commandsLauncher = new CommandsLauncher(this.context, this.logger, this.stateManager)
        const { launch } = commandsLauncher
    
        const startTime = new Date().getTime();
        const endTime = startTime + 60000; // 1 minutes in milliseconds
    
        await launch(
            "State List",
            "get-resources",
            undefined,
            () => {}
        )
        let resolve
        let tooLong
        let stateList
        let total = 0
        let newStateFile = false
        if (!this.fileHandler) this.initFileHandler()
        const interval = setInterval(() => {
            stateList = this.fileHandler.getStateList() || { ts: 0, content: "", total}
            const tooLong =  (new Date().getTime() > endTime)
            newStateFile = newStateFile || (stateList.total > total && total !== 0)
            total = stateList.total
            const newContent = newStateFile && stateList.content.length > 10
            if (newContent || tooLong) resolve()
        }, 500)
        
        await new Promise(_resolve => {
            resolve = _resolve
        })
        clearInterval(interval)
        if (tooLong) return

        let tsAfter = 0
        let tsBefore = 0
        let showMenuAttempts = 0
        let selectionDurationMS = 0
        let targets = []

        while (!(targets || []).length && (selectionDurationMS < 3000) && showMenuAttempts < 8){
            tsBefore = new Date().getTime()
            const resources = stateList.content
                .split("\n")
                .map(resource => resource.replaceAll("\n", "").replaceAll("\r", ""))
            if (!resources || resources.length < 2) return this.abort()
            targets = await vscode.window.showQuickPick(resources,
              {
                canPickMany: true, // Enable multiple selections
                placeHolder: 'Select one or more options'
              })
            tsAfter = new Date().getTime()
            selectionDurationMS = tsAfter - tsBefore
            showMenuAttempts++
        }
        if (!targets) return
        this.targets = targets.join(",")
    }
    
  
    constructor(context, logger, stateManager, tfCommandId){
        super(context, logger, stateManager, tfCommandId);
        this.addOption = true
        this.multipleTargetSelection = true
    }
} }
