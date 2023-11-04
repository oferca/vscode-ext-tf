const path = require('path');
const vscode = require('vscode');
const {
    reminder,
    isWindows,
    tryItText,
    lastRunKey,
    runCountKey,
    stationIdKey,
    instructions,
    powershellType,
    changeFolderKey,
    welcomeNotifiedKey,
    lastTerminalNoticeKey,
    shellNoticeIntervalSec,
    lastShellDisclaimerKey,
    hasSupportedTerminalKey,
    dontRemindDisclaimerKey,
    intervalUsageReminderSec,
    dashboardExpendedOnceKey,
    shellNoticeIntervalHasSupportedSec
} = require("../shared/constants")

const { unsupportedShellNote, isCmd, sendText, capitalizeFirst } = require("../shared/methods")
const { createShellHandler, isPowershell } = require("../shared/methods-cycle")

const secondsInWeek = 60 * 60 * 24 * 7
const secondsInHour = 60 * 60
const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;

class StateManager {

    now
    context
    usedOnce
    lastRunTS
    shouldRemind
    activeTerminal
    commandHandler
    timeSinceLastUseSec
    previouslyOpenedTerminal

    get isFirstActivation() {
        return !(this.usedOnce && !this.shouldRemind)
    }

    async notifyFirstActivation() {
        if (!this.isFirstActivation) return false

        // Log message
        const { timeSinceLastUseSec, usedOnce } = this
        await this.logger.log({ message: this.shouldRemind ? reminder : instructions, timeSinceLastUseSec, usedOnce })

        // Update welcome notified
        this.updateState(welcomeNotifiedKey, true);
        if (this.shouldRemind) this.updateState(lastRunKey, this.now)
        this.updateState(dashboardExpendedOnceKey, undefined)

        // Create new terminal
        const terminal = vscode.window.createTerminal();
        terminal.show();

        await vscode.window.showInformationMessage(this.shouldRemind ? reminder : instructions, { title: tryItText });

    }

    updateState(key, value) {
        if (this.disableStateUpdate) return
        this.context.globalState.update(key + this.keyPostfix, value)
        return value
    }
    getState(key) {
        if (this.disableStateRead) return
        return this.context.globalState.get(key + this.keyPostfix) || this.context.workspaceState.get(key + this.keyPostfix)
    }
    async handleShellDisclaimer() {
        const hasSupportedTerminal = this.getState(hasSupportedTerminalKey) || false
        const lastNoticeTS = this.getState(lastShellDisclaimerKey) || 0
        const timeSinceLastNotice = (this.now - lastNoticeTS) / 1000
        const interval = hasSupportedTerminal ? shellNoticeIntervalHasSupportedSec : shellNoticeIntervalSec
        const timeToShowDisclaimer = true // timeSinceLastNotice > interval
        if (!timeToShowDisclaimer) return
        this.updateState(lastShellDisclaimerKey, this.now);
        const neverRemind = this.getState(dontRemindDisclaimerKey) || false
        if (neverRemind) return
        const dontRemindStr = 'Don\'t remind again'
        const msg = unsupportedShellNote(this.activeTerminal, hasSupportedTerminal)
        const selection = await vscode.window.showInformationMessage(
            msg,
            { title: tryItText },
            { title: dontRemindStr }
        );

        await this.logger.log({
            msg,
            selection,
            hasSupportedTerminal,
            lastNoticeTS,
        })

        const timeForReDisclaimer = timeSinceLastNotice > shellNoticeIntervalSec
        if (timeForReDisclaimer) return this.updateState(dontRemindDisclaimerKey, false);
        if (selection.title === dontRemindStr) this.updateState(dontRemindDisclaimerKey, true);
    }
    handleTerminalNotice (terminal) {
		const now = new Date().getTime(),
            lastRunTS = this.getState(lastRunKey) || 0,
		    lastTerminalNoticeTS = this.getState(lastTerminalNoticeKey) || 0,
            timeSinceLastUseSec = (now - lastRunTS) / 1000,
            timeSinceLastTerminalNoticeSec = (now - lastTerminalNoticeTS) / 1000,
            runCount = this.getState(runCountKey),
            notEnoughUsages = runCount < 15,
            hasntUsedRecently = timeSinceLastUseSec > secondsInWeek,
            noticeGivenRecently = timeSinceLastTerminalNoticeSec < secondsInHour,
            shouldGiveNotice = notEnoughUsages || hasntUsedRecently && !noticeGivenRecently,
            isUnsupportedTerminal = isCmd(terminal) || (isWindows && !isPowershell(terminal))
            
	    if (!shouldGiveNotice || isUnsupportedTerminal) return
		this.updateState(lastTerminalNoticeKey, now)
        setTimeout(async () => await sendText(terminal, "clear; " + createShellHandler(terminal).getCheckTFCommand()), 600)
    }
    init() {
        this.now = new Date().getTime();
        this.usedOnce = this.getState(welcomeNotifiedKey) || false;
        this.lastRunTS = this.getState(lastRunKey) || 0
        this.timeSinceLastUseSec = (this.now - this.lastRunTS) / 1000
        this.shouldRemind = this.lastRunTS > 0 && this.timeSinceLastUseSec > intervalUsageReminderSec
        this.shellType = isPowershell(this.activeTerminal) ? powershellType : ""
        this.logger.stationId = this.getState(stationIdKey) || this.updateState(stationIdKey, this.uniqueId)
        const instructionsCount = this.getState('tfInstructions') || 0
        this.updateState('tfInstructions', instructionsCount + 1)
        // if (instructionsCount > 20) this.showInstructions = false
    }
    getUserFolder () {
        return this.getState(changeFolderKey)
    }
    setUserFolder (folder) {
        this.updateState(changeFolderKey, folder) 
    }
    openProjectTerminal(projectKey) {
        this.previouslyOpenedTerminal = vscode.window.activeTerminal
        const projectTerminal = vscode.window.terminals.find(terminal => terminal.tfProjectKey === projectKey)
         || vscode.window.createTerminal()
        const alreadyCreated = projectTerminal.tfProjectKey
        projectTerminal.tfProjectKey = projectTerminal.tfProjectKey || projectKey
        // if (alreadyCreated && (new Date().getTime() - projectTerminal.lastOpenedTS > 1 )) this.showInstructions = true
        projectTerminal.lastOpenedTS = new Date().getTime()
        projectTerminal.show()
        let projectName = capitalizeFirst(path.basename(projectKey))
        let asteriks = ""
        let text = `Terraform Terminal for '${projectName}' Project`
        if (!(projectName.length > 1)) text = "Any Project Terraform Terminal"
        for(let i = 0; i< text.length; i++) asteriks += "-"
        if (alreadyCreated) return
        projectTerminal.sendText(`clear;echo "${asteriks}\n${text}\n${asteriks}\nPlease set environment variables for running terraform.\nFor example: export AWS_ACCESS_KEY_ID=\"ASIA...\"; export AWS_SECRET_ACCESS_KEY==\"abcde...\"; \n"`)
        projectTerminal.counter = projectTerminal.counter ? projectTerminal.counter + 1 : 1
        this.selectedProjectTerminal = projectTerminal
        this.showInstructions = false
    }
    openPreviousTerminal() {
        this.previouslyOpenedTerminal.show()
    }
    
    constructor(context, logger, disableStateUpdate = false, disableStateRead = false, keyPostfix = "") {
        this.context = context
        this.logger = logger
        this.disableStateUpdate = disableStateUpdate
        this.disableStateRead = disableStateRead
        this.keyPostfix = keyPostfix
        this.uniqueId = new Date().valueOf()
        this.showInstructions = true
    }

}

module.exports = { StateManager }
