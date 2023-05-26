class LifecycleManager {

    context
    handleFirstActivation = async () => {
        const context = this.context
        const now = new Date().getTime();
        const usedOnce = context.workspaceState.get(usedOnceKey) || false;
        const lastRunTS = context.workspaceState.get(lastRunKey) || 0
        const timeSinceLastUseSec = (now - lastRunTS) / 1000
        const shouldRemind = lastRunTS && (timeSinceLastUseSec > intervalUsageReminderSec)
        if (usedOnce && !shouldRemind) return false
        const msg = shouldRemind ? reminderNote : thankYouNote
        await vscode.window.showInformationMessage( msg, { modal: true } );
        
        setLog({
            ts: Date.now(),
            msg,
            platform: os.platform(),
            timeSinceLastUseSec,
            usedOnce,
        })
    
        context.workspaceState.update(usedOnceKey, true);
        if (shouldRemind) context.workspaceState.update(lastRunKey, now)
    
        const terminal = vscode.window.createTerminal();
        terminal.show();
        vscode.commands.executeCommand(mainCommandId);
    
        vscode.window.showInformationMessage( instructionsEnvVar, { title: reminderActionText } );
        vscode.window.showInformationMessage( instructions, { title: reminderActionText } );
        return true
    }
    constructor(context){
        this.context = context
    }

}

module.exports = { LifecycleManager }
