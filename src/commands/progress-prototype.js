const vscode = require('vscode');
const { CommandHandlerPrototype } = require("./handler-prototype")
const { getCompletionPercentage, getProgressMsg, getRawCommand } = require("../shared/methods")
const {
    lastRunKey,
    noColorExt,
    errorStatus,
    gotoTerminal,
    tfApplyCommandId,
    maxNotificationTime,
    maxCompletionPercentage
} = require('../shared/constants');

class ProgressHandlerPrototype extends CommandHandlerPrototype {
    abort
    intervalID
    lastRecorded
    barCreationTimestamp
    barCompletionTimestamp
    currentBarCompletionPercentage

    get completionPercentage () {
        return getCompletionPercentage(
            this.barCreationTimestamp,
            this.barCompletionTimestamp,
            this.fileHandler.isDefaultDuration 
        ) 
    }

    launchProgress() {
        if (!this.fileHandler.initialized) return
        this.barCreationTimestamp = Date.now()
        this.currentBarCompletionPercentage = 0
        this.barCompletionTimestamp = this.barCreationTimestamp + this.fileHandler.durationEstimate * 1000
        const progressFileName = `${this.outputFile}.${noColorExt}`
        const progressFileMsg = this.redirect ? ` [Click here to see output logs](file://${progressFileName}). Completed` : ''

        const listener = vscode.workspace.onDidOpenTextDocument((document) => {
            if (document.fileName === progressFileName) {
                const folder = vscode.workspace.workspaceFolders[0];
                const uri = vscode.Uri.file(folder.uri.fsPath + "/.terraform");
                vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders', uri);
                listener.dispose()
            }
        });
        this.textDucumentListener = listener
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: getProgressMsg(this.commandId) + progressFileMsg,
            cancellable: true
        }, this.progressUpdate )
    }

    completed () {
        const isMaxProgress = this.completionPercentage > maxCompletionPercentage
        const applyPlanCompleted = this.commandId == tfApplyCommandId && isMaxProgress
        const noRedirectCompleted = isMaxProgress && !this.redirect
        return this.fileHandler.completed || applyPlanCompleted || noRedirectCompleted
    }

    notifyCompletion () {
        const rawCommand = getRawCommand(this.commandId)
        const capitalized = rawCommand.charAt(0).toUpperCase() + rawCommand.slice(1)
        const completionTerm = this.redirect ? "completed" : rawCommand === "apply" ? "planning completed" : "ended"
        let notification
        if (!this.redirect) notification = vscode.window.showInformationMessage("Terraform " + capitalized + ` ${completionTerm}.`, gotoTerminal);
        const summary = this.redirect && this.fileHandler.getCompletionSummary() 
        if (summary === errorStatus) notification = vscode.window.showErrorMessage(`Terraform ${capitalized} ended with errors`, gotoTerminal);
        if (summary.warnings && summary.warnings.length) notification = vscode.window.showWarningMessage(`Terraform ${capitalized} ended with warnings. ` + summary.message, gotoTerminal);
        if (!notification) notification = vscode.window.showInformationMessage(rawCommand === "Plan" ? `Terraform ${capitalized} ${completionTerm}. ` : "" + summary.message, gotoTerminal);
    
        return notification
    }
    handleOutputFileUpdates () {
        if (!this.redirect)  return
        this.fileHandler.convertOutputToReadable()
    }

    async progressUpdate (progress, token) {
        token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
            clearInterval(this.intervalID);
        });
        const self = this
        this.intervalID = setInterval(() => {
            self.handleOutputFileUpdates()
            progress.report({ message: parseInt(self.completionPercentage) + "%.", increment: self.completionPercentage - self.lastRecorded  });
            self.lastRecorded = self.completionPercentage 
        }, 100)
        
        const p = new Promise(resolve => {
            const completedIntervalId = setInterval(async () => {
                if (self.completed() || self.abort) {
                    clearInterval(self.intervalID);
                    clearInterval(completedIntervalId)
                    resolve()
                    const isApply = self.commandId.indexOf(tfApplyCommandId) > -1
                    if (self.fileHandler.isDefaultDuration && isApply) return
                    const selection = await self.notifyCompletion()
                    if (selection === gotoTerminal) {
                        self.activeTerminal.show();
                    }
                }
            }, 100)
            setTimeout(() => {
                resolve();
            }, maxNotificationTime);
        });
        return p;
    }

    launchProgressNotification () {
        const message = getProgressMsg(this.commandId)
        this.launchProgress(message)
    }

    async execute () {
        const now = new Date().getTime();
        this.lifecycleManager.updateState(lastRunKey, now);
        if (!vscode.window.activeTerminal) return await this.verifyOpenTerminal()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp()
            self.launchProgressNotification()
            self.runBash()
        }
        await this.init(onChildProcessCompleteStep2)
        
    }

    constructor(context, logger, lifecycleManager, commandId){
        super(context, logger, lifecycleManager, commandId);
        this.lastRecorded = 0
        this.execute = this.execute.bind(this)
        this.runBash = this.runBash.bind(this)
        this.completed = this.completed.bind(this)
        this.launchProgress = this.launchProgress.bind(this)
        this.progressUpdate = this.progressUpdate.bind(this)
        this.notifyCompletion = this.notifyCompletion.bind(this)
        this.handleOutputFileUpdates = this.handleOutputFileUpdates.bind(this)
        this.launchProgressNotification = this.launchProgressNotification.bind(this)
    }
}

module.exports = { ProgressHandlerPrototype }
