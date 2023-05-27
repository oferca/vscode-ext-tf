const fs = require('fs');
const os = require('os');
const path = require('path');
const vscode = require('vscode');
const exec = require('child_process').exec;
const findRemoveSync = require('find-remove');
const {
    timeExt,
    noColorExt,
    lastRunKey,
    errorStatus,
    rootFolderName,
    defaultEstimate,
    hasSupportedTerminalKey
} = require("./shared/constants")
const {
    extractCWD,
    getWarnings,
    removeColors,
    tfCommandSuccess,
    featuresDisabled,
    handleShellDisclaimer,
    createOutputFileName,
    calculateAverageDuration
} = require("./shared/methods")

class FileHandler {
    mode
    logger
    commandId
    outputFile
    dataFolder
    initialized
    moduleFolder
    averageFromCmd
    durationEstimate

    deleteOldFiles() {
        const secondsInDay = 86400
        const secondsInTwoWeeks = 1209600
        findRemoveSync(this.dataFolder, { age: { seconds: secondsInDay }, extensions: "." + timeExt });
        findRemoveSync(this.dataFolder, { age: { seconds: secondsInDay }, extensions: "." + noColorExt });
        findRemoveSync(this.dataFolder, { age: { seconds: secondsInTwoWeeks }, extensions: ".txt" });
    }

    calculateAverageDuration() {
        return calculateAverageDuration(this.dataFolder, this.averageFromCmd || this.commandId)
    }

    get completed() {
        return fs.existsSync(this.outputFile + "." + timeExt)
    }

    async init(step2Cb) {
        const { activeTerminal } = vscode.window
        if (featuresDisabled(activeTerminal)) {
            await this.lifecycleManager.handleShellDisclaimer()
            return step2Cb && step2Cb()
        }
        this.lifecycleManager.updateState(hasSupportedTerminalKey, true);
        const processId = await vscode.window.activeTerminal.processId

        const result = await vscode.window.activeTerminal.sendText(`Set-Content -Path (Join-Path -Path ${os.tmpdir()} -ChildPath "cwda.txt") -Value $PWD`);

        exec(`Set-Content -Path (Join-Path -Path ${os.tmpdir()} -ChildPath "cwda.txt") -Value $PWD`, (...args) => {
            //    exec(`lsof -p ${processId} | grep cwd`, (...args) => {
            args.push(cb)
            this.handleDataFolder(...args)
        });
        return true
    }

    handleDataFolder(error, stdout, stderr, cb) {
        const subFolderName = extractCWD(stdout)
        this.dataFolder = path.join(os.tmpdir(), rootFolderName, subFolderName)
        if (!fs.existsSync(this.dataFolder)) fs.mkdirSync(this.dataFolder, { recursive: true })
        this.outputFile = createOutputFileName(this.dataFolder, this.commandId)
        this.deleteOldFiles()
        this.durationEstimate = this.calculateAverageDuration() || defaultEstimate
        this.initialized = true
        cb()
    }

    get isDefaultDuration() {
        return this.durationEstimate === defaultEstimate
    }

    get outputFileNoColor() {
        return this.outputFile + "." + noColorExt
    }
    convertOutputToReadable() {
        const outputFile = fs.readFileSync(this.outputFile, "utf-8")
        fs.writeFileSync(
            this.outputFileNoColor,
            removeColors(outputFile)
        )
    }

    getCompletionSummary() {
        const outputFile = fs.readFileSync(this.outputFileNoColor, "utf-8")
        const warnings = getWarnings(outputFile)
        const message = tfCommandSuccess(outputFile)
        return message ? {
            warnings,
            message
        } : errorStatus
    }

    constructor(commandId, averageFromCmd, context, logger, lifecycleManager) {
        this.logger = logger
        this.context = context
        this.commandId = commandId
        this.averageFromCmd = averageFromCmd
        this.lifecycleManager = lifecycleManager
        this.initialized = false
        this.firstActivation = false
        this.handleDataFolder = this.handleDataFolder.bind(this)
        this.convertOutputToReadable = this.convertOutputToReadable.bind(this)
    }
}

module.exports = { FileHandler }
