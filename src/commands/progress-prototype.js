const vscode = require('vscode');
const { CommandHandlerPrototype } = require("./handler-prototype")
const {
    getRawCommand,
    getProgressMsg,
    createFolderCollapser,
    getCompletionPercentage
} = require("../shared/methods")

const {
    noColorExt,
    errorStatus,
    gotoTerminal,
    noCredentials,
    noCredentialsMsg,
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
        const progressFileMsg = this.redirect ? ` [Click here to see output logs](file:${this.shellHandler.filePrefix}${progressFileName}). Completed` : ''
        const openDocumentHandler = createFolderCollapser(progressFileName, listener)
        const listener = vscode.workspace.onDidOpenTextDocument(openDocumentHandler);

        this.textDocumentListener = listener
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
        const rawCommand = getRawCommand(this.commandId),
            capitalized = rawCommand.charAt(0).toUpperCase() + rawCommand.slice(1),
            completionTerm = this.redirect ? "completed" : rawCommand === "apply" ? "planning completed" : "ended"
        
        let notification
        if (!this.redirect) notification = vscode.window.showInformationMessage("Terraform " + capitalized + ` ${completionTerm}.`, gotoTerminal);

        const summary = this.redirect && this.fileHandler.getCompletionSummary(),
            progressFileName = `${this.outputFile}.${noColorExt}`,
            outputLogsMsg = this.redirect ? ` [Click here to see output logs.](file:${this.shellHandler.filePrefix}${progressFileName})` : '',
            hasErrors = summary === errorStatus || summary === noCredentials

        if (hasErrors) notification = vscode.window.showErrorMessage(`Terraform ${capitalized} ended with errors. ` + (summary === noCredentials ? noCredentialsMsg : outputLogsMsg), gotoTerminal);
        if (summary.warnings && summary.warnings.length) notification = vscode.window.showWarningMessage(`Terraform ${capitalized} ended with warnings. ` + summary.message + outputLogsMsg, gotoTerminal);
        if (!notification) notification = vscode.window.showInformationMessage(rawCommand === "Plan" ? `Terraform ${capitalized} ${completionTerm}. ` : "" + summary.message + outputLogsMsg, gotoTerminal);
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
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp()
            self.launchProgressNotification()
            self.runBash()
        }
        await this.init(onChildProcessCompleteStep2)
        
    }

    constructor(context, logger, lifecycleManager, shellHandler, commandId){
        super(context, logger, lifecycleManager, shellHandler, commandId);
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
