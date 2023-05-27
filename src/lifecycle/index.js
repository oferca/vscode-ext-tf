const vscode = require('vscode');
const {
    lastRunKey,
    usedOnceKey,
    reminderNote,
    thankYouNote,
    instructions,
    mainCommandId,
    powershellType,
    instructionsEnvVar,
    reminderActionText,
    shellNoticeIntervalSec,
    lastShellDisclaimerKey,
    hasSupportedTerminalKey,
    dontRemindDisclaimerKey,
    intervalUsageReminderSec,
    shellNoticeIntervalHasSupportedSec
} = require("../shared/constants")

const { unsupportedShellNote, isPowershell } = require("../shared/methods")
class LifecycleManager {

    now
    context
    usedOnce
    lastRunTS
    shouldRemind
    activeTerminal
    timeSinceLastUseSec

    get isFirstActivation() {
        return !(this.usedOnce && !this.shouldRemind)
    }

    async notifyFirstActivation() {
        if (!this.isFirstActivation) return false
        const msg = this.shouldRemind ? reminderNote : thankYouNote
        await vscode.window.showInformationMessage(msg, { modal: true });
        const { timeSinceLastUseSec, usedOnce } = this
        await this.logger.log({
            msg,
            timeSinceLastUseSec,
            usedOnce
        })
        this.updateState(usedOnceKey, true);
        if (this.shouldRemind) this.updateState(lastRunKey, this.now)
        const terminal = vscode.window.createTerminal();
        terminal.show();
        vscode.commands.executeCommand(mainCommandId);

        vscode.window.showInformationMessage(instructionsEnvVar, { title: reminderActionText });
        vscode.window.showInformationMessage(instructions, { title: reminderActionText });
    }

    updateState(key, value) {
        if (this.disableStateUpdate) return
        this.context.workspaceState.update(key + this.keyPostfix, true, value)
    }
    getState(key) {
        if (this.disableStateRead) return
        return this.context.workspaceState.get(key + this.keyPostfix)
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
            { title: reminderActionText },
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
    init() {
        this.now = new Date().getTime();
        this.usedOnce = this.getState(usedOnceKey) || false;
        this.lastRunTS = this.getState(lastRunKey) || 0
        this.timeSinceLastUseSec = (this.now - this.lastRunTS) / 1000
        this.shouldRemind = !isNaN(parseInt(this.lastRunTS)) && (this.timeSinceLastUseSec > intervalUsageReminderSec)
        this.shellType = isPowershell(vscode.window.activeTerminal) ? powershellType : ""
        this.logger.uniqueId = this.uniqueId
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

module.exports = { LifecycleManager }
