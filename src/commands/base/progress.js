const vscode = require('vscode');
const { CommandHandlerPrototype } = require(".")

const {
    getRawCommand,
    getProgressMsg,
    capitalizeFirst,
    featuresDisabled,
    createFolderCollapser,
    getCompletionPercentage
} = require("../../shared/methods")

const {
    errorStatus,
    noCredentials,
    noCredentialsMsg,
    tfApplyCommandId,
    notificationTimout,
    maxNotificationTime,
    maxCompletionPercentage
} = require('../../shared/constants');

class ProgressHandlerPrototype extends CommandHandlerPrototype {
    abort
    intervalID
    lastRecorded
    progressFileMsg
    barCreationTimestamp
    transformOutputColors
    barCompletionTimestamp
    currentBarCompletionPercentage

    get completionPercentage() {
        return getCompletionPercentage(
            this.barCreationTimestamp,
            this.barCompletionTimestamp,
            this.fileHandler.isDefaultDuration
        )
    }

    launchProgress(outputUpdatedCallback, completedCallback = () => {}) {
        this.barCreationTimestamp = Date.now()
        this.currentBarCompletionPercentage = 0
        this.barCompletionTimestamp = this.barCreationTimestamp + this.fileHandler.durationEstimate * 1000

        const outputLogsTxt = ` [ Watch Logs.](file:${this.fileHandler.outputFileVSCodePath})`
        this.progressFileMsg = this.redirect ? outputLogsTxt : ''

        let listener
        const openDocumentHandler = createFolderCollapser(this.fileHandler.outputFileNoColor, listener, this.fileHandler)
        listener = vscode.workspace.onDidOpenTextDocument(openDocumentHandler)

        this.fileHandler.outputCB = (bottom = false, content) => {
            outputUpdatedCallback && outputUpdatedCallback(content, this.completionPercentage)
            const editor = vscode.window.activeTextEditor;
            if (!editor || !this.fileHandler.outputFileNoColor) return
            const outputFileOpen = editor.document.fileName.toLowerCase() === this.fileHandler.outputFileNoColor.toLowerCase()
            if (outputFileOpen) {
                const lastLine = editor.document.lineCount - (bottom ? 0 : 3);
                const range = editor.document.lineAt(lastLine).range;
                editor.revealRange(range, vscode.TextEditorRevealType.Default);
            }
        }

        this.textDocumentListener = listener

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: getProgressMsg(this.commandId),//  + progressFileMsg,
            cancellable: true
        }, (progress, token) => this.progressUpdate(progress, token, completedCallback))
    }

    completed() {
        const isMaxProgress = this.completionPercentage > maxCompletionPercentage
        const applyPlanCompleted = this.commandId == tfApplyCommandId && isMaxProgress
        const noRedirectCompleted = isMaxProgress && !this.redirect
        return this.fileHandler.completed || applyPlanCompleted || noRedirectCompleted
    }

    notifyCompletion(completedCallback) {
        const rawCommand = getRawCommand(this.commandId),
            capitalized = capitalizeFirst(rawCommand),
            completionTerm = this.redirect ? "completed" : rawCommand === "apply" ? "planning completed" : "ended"

        let notification
        let generalMessage
        if (!this.redirect) {
            generalMessage = "Terraform " + capitalized + ` ${completionTerm}.`
            notification = vscode.window.showInformationMessage(message);
        }
        
        const summary = this.redirect && this.fileHandler.completionSummary || {},
            outputLogsMsg = this.redirect ? ` [ Watch Logs.](file:${this.fileHandler.outputFileVSCodePath})` : '',
            hasErrors = summary === errorStatus || summary === noCredentials,
            errTxt = `Terraform ${capitalized} ended with errors. ` + (summary === noCredentials ? noCredentialsMsg : outputLogsMsg),
            errTxtPref = errTxt.replace(outputLogsMsg, ""),
            warnTxtPref = `Terraform ${capitalized} ended with warnings. ` + summary.message,
            warnTxt = warnTxtPref + outputLogsMsg

        if (hasErrors) notification = vscode.window.showErrorMessage(errTxt);
        if (summary === noCredentials) {
            this.stateManager.missingCredentials = true
            this.logger.log("missing-credentials")
        }
    
        const hasWarnings = summary.warnings && summary.warnings.length
        if (hasWarnings) notification = vscode.window.showWarningMessage(warnTxt);
        let successMessage
        if (!notification) {
            successMessage = rawCommand === "Plan" ? `Terraform ${capitalized} ${completionTerm}. ` : "" + (summary.message || `Terraform ${capitalized} completed.`) + outputLogsMsg
            notification = vscode.window.showInformationMessage(successMessage);
        }

        completedCallback(
            generalMessage && { type: 'info', msg: generalMessage } ||
            hasErrors && { type: 'error', msg: errTxtPref} ||
            hasWarnings && { type: 'warning', msg: warnTxtPref} ||
            { type: 'success', msg: (successMessage || "").replace(outputLogsMsg, "") }
        )
        this.fileHandler.referUserToTerminal()

        return notification
    }

    handleOutputFileUpdates() {
        if (!this.redirect) return
        this.fileHandler.convertOutputToReadable()
        if (this.fileHandler.completed) setTimeout(() => this.fileHandler.outputCB(true), 100)
    }

    async progressUpdate(progress, token, completedCallback = () => { }) {

        token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
            clearInterval(this.intervalID);
        });
        const self = this

        this.intervalID = setInterval(() => {
            self.handleOutputFileUpdates()
            progress.report({
                message: parseInt(self.completionPercentage) + "% complete." + self.progressFileMsg,
                increment: self.completionPercentage - self.lastRecorded
            });
            self.lastRecorded = self.completionPercentage
        }, 100)

        const p = new Promise(resolve => {
            const completedIntervalId = setInterval(() => {
                const completed = self.completed()
                if (completed || self.abort) {
                    self.logger.log({
                        completed,
                        commandId: self.commandId
                    })
                    clearInterval(self.intervalID);
                    clearInterval(completedIntervalId)
                    resolve()
                    const isApply = self.commandId.indexOf(tfApplyCommandId) > -1
                    if (self.fileHandler.isDefaultDuration && isApply) return
                    setTimeout(() => self.notifyCompletion(completedCallback), notificationTimout)
                }
            }, 100)
            setTimeout(() => {
                cb && cb()
                resolve();
            }, maxNotificationTime);
        });
        return p;
    }

    launchProgressNotification(outputUpdatedCallback, completedCallback) {
        this.launchProgress(outputUpdatedCallback, completedCallback)
    }

    async execute(source, completedCallback, outputUpdatedCallback = () => {}) {
        if (featuresDisabled(this.stateManager.activeTerminal)) return await vscode.window.showInformationMessage("Please use supported terminal such as Powershell or bash")
        this.updateRunCount()
        const self = this
        const onChildProcessCompleteStep2 = async () => {
            await self.logOp(source)
            if (this.executeHook) await this.executeHook()
            if (this.redirect) self.launchProgressNotification(outputUpdatedCallback, completedCallback)
            const completionCB = this.redirect ? () => {} : completedCallback
            self.runBash(completionCB)
        }
        await this.init(onChildProcessCompleteStep2)
    }

    constructor(context, logger, stateManager, shellHandler, commandId) {
        super(context, logger, stateManager, shellHandler, commandId);
        this.lastRecorded = 0
        this.transformOutputColors = true
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
