const vscode = require('vscode');
const {
    isWindows,
    tryItText,
    lastRunKey,
    runCountKey,
    reminderNote,
    thankYouNote,
    instructions,
    mainCommandId,
    powershellType,
    credentialsKey,
    changeFolderKey,
    welcomeNotifiedKey,
    lastTerminalNoticeKey,
    shellNoticeIntervalSec,
    lastShellDisclaimerKey,
    hasSupportedTerminalKey,
    dontRemindDisclaimerKey,
    intervalUsageReminderSec,
    shellNoticeIntervalHasSupportedSec
} = require("../shared/constants")

const { unsupportedShellNote, isPowershell, isCmd } = require("../shared/methods")
const { BashHandler } = require("../shared/shells/bash")
const { PowershellHandler } = require("../shared/shells/powershell")

const secondsInWeek = 60 * 60 * 24 * 7
const secondsInHour = 60 * 60
class StateManager {

    now
    context
    usedOnce
    lastRunTS
    shouldRemind
    commandHandler
    activeTerminal
    timeSinceLastUseSec

    get isFirstActivation() {
        return !(this.usedOnce && !this.shouldRemind)
    }

    async notifyFirstActivation() {
        if (!this.isFirstActivation) return false

        // Show welcome message
        const msg = this.shouldRemind ? reminderNote : thankYouNote
        await vscode.window.showInformationMessage(msg, { modal: true });

        // Log message
        const { timeSinceLastUseSec, usedOnce } = this
        await this.logger.log({ msg, timeSinceLastUseSec, usedOnce })

        // Update welcome notified
        this.updateState(welcomeNotifiedKey, true);
        if (this.shouldRemind) this.updateState(lastRunKey, this.now)

        // Create new terminal
        const terminal = vscode.window.createTerminal();
        terminal.show();

        const selection = await vscode.window.showInformationMessage(instructions, { title: tryItText });
        if (selection.title == tryItText) vscode.commands.executeCommand(mainCommandId);

    }

    updateState(key, value) {
        if (this.disableStateUpdate) return
        this.context.globalState.update(key + this.keyPostfix, value)
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
        const timeToShowDisclaimer = timeSinceLastNotice > interval
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
        const ShellHandler = isPowershell(terminal) ? PowershellHandler: BashHandler
        const shellHandler = new ShellHandler()
        setTimeout(() => terminal.sendText("clear; " + shellHandler.getCheckTFCommand()), 600)
    }
    init() {
        this.now = new Date().getTime();
        this.usedOnce = this.getState(welcomeNotifiedKey) || false;
        this.lastRunTS = this.getState(lastRunKey) || 0
        this.timeSinceLastUseSec = (this.now - this.lastRunTS) / 1000
        this.shouldRemind = this.lastRunTS > 0 && this.timeSinceLastUseSec > intervalUsageReminderSec
        this.shellType = isPowershell(vscode.window.activeTerminal) ? powershellType : ""
        this.logger.uniqueId = this.uniqueId
        this.credentials = this.getState(credentialsKey)
    }

    getUserFolder () {
        return this.getState(changeFolderKey)
    }
    setUserFolder (folder) {
        this.updateState(changeFolderKey, folder) 
    }
    constructor(context, logger, disableStateUpdate = false, disableStateRead = false, keyPostfix = "") {
        this.context = context
        this.logger = logger
        this.disableStateUpdate = disableStateUpdate
        this.disableStateRead = disableStateRead
        this.keyPostfix = keyPostfix
        this.activeTerminal = vscode.window.activeTerminal
        this.uniqueId = new Date().valueOf()
    }

}

module.exports = { StateManager }