const vscode = require('vscode');

const {
    usedOnceKey,
    lastRunKey,
    reminderNote,
    thankYouNote,
    instructions,
    instructionsEnvVar,
    reminderActionText
} = require("../shared/constants")

class LifecycleManager {
   
    now
    context
    usedOnce
    lastRunTS
    shouldRemind
    timeSinceLastUseSec

    get isFirstActivation () {
        return !(this.usedOnce && !this.shouldRemind)
    }

    async notifyFirstActivation () {
        if (!this.isFirstActivation) return false
        const msg = this.shouldRemind ? reminderNote : thankYouNote
        await vscode.window.showInformationMessage( msg, { modal: true } );
        const { timeSinceLastUseSec, usedOnce } = this
        this.logger.log({
            msg,
            timeSinceLastUseSec,
            usedOnce
        })
        context.workspaceState.update(usedOnceKey, true);
        if (shouldRemind) context.workspaceState.update(lastRunKey, this.now)
        const terminal = vscode.window.createTerminal();
        terminal.show();
        vscode.commands.executeCommand(mainCommandId);
    
        vscode.window.showInformationMessage( instructionsEnvVar, { title: reminderActionText } );
        vscode.window.showInformationMessage( instructions, { title: reminderActionText } );
    }

    updateState (key, value) {
        if (this.disableStateUpdate) return
        this.context.workspaceState.update(key + this.keyPostfix, true, value)
    }
    getState (key) {
        return this.context.workspaceState.get(key + this.keyPostfix)
    }
    async handleShellDisclaimer (activeTerminal) {
        const context = this.context
        const hasSupportedTerminal = context.workspaceState.get(hasSupportedTerminalKey) || false
        const lastNoticeTS = context.workspaceState.get(lastShellDisclaimerKey) || 0
        const timeSinceLastNotice = (now - lastNoticeTS) / 1000
        const interval = hasSupportedTerminal ? shellNoticeIntervalHasSupportedSec : shellNoticeIntervalSec
        const timeToShowDisclaimer = timeSinceLastNotice > interval
        if (!timeToShowDisclaimer) return
        context.workspaceState.update(lastShellDisclaimerKey, this.now);
        const neverRemind = context.workspaceState.get(dontRemindDisclaimerKey) || false
        if (neverRemind) return
        const dontRemindStr ='Don\'t remind again'
        const msg = unsupportedShellNote(activeTerminal, hasSupportedTerminal)
        const selection = await vscode.window.showInformationMessage(
            msg,
            { title: reminderActionText },
            { title: dontRemindStr }
            );
        this.logger.log({
            msg,
            selection,
            hasSupportedTerminal,
            lastNoticeTS,
        })
        const timeForReDisclaimer = timeSinceLastNotice > shellNoticeIntervalSec
        if (timeForReDisclaimer) return context.workspaceState.update(dontRemindDisclaimerKey, false);
        if (selection.title === dontRemindStr) context.workspaceState.update(dontRemindDisclaimerKey, true);
    }
    init () {
        this.now = new Date().getTime();
        this.usedOnce = this.context.workspaceState.get(usedOnceKey) || false;
        this.lastRunTS = context.workspaceState.get(lastRunKey) || 0
        this.timeSinceLastUseSec = (now - lastRunTS) / 1000
        this.shouldRemind = lastRunTS && (timeSinceLastUseSec > intervalUsageReminderSec)
    }

    constructor(context, logger, disableStateUpdate = false, disableStateRead = false, keyPostfix = ""){
        this.context = context
        this.logger = logger
        this.disableStateUpdate = disableStateUpdate
        this.disableStateRead = disableStateRead
        this.keyPostfix = keyPostfix
    }

}

module.exports = { LifecycleManager }
