const fs = require('fs');
const os = require('os');
const path = require('path');
const vscode = require('vscode');
const findRemoveSync = require('find-remove');

const {
    timeExt,
    noColorExt,
    errorStatus,
    noCredentials,
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
    createOutputFileName,
    calculateAverageDuration
} = require("./shared/methods")

class FileHandler {
    mode
    logger
    outputCB
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
        return calculateAverageDuration(
            this.dataFolder,
            this.averageFromCmd || this.commandId,
            this.shellHandler.fileEncoding
        )
    }

    get completed() {
        return fs.existsSync(this.outputFile + "." + timeExt)
    }

    async init(step2Cb) {
        const { activeTerminal } = vscode.window

        if (featuresDisabled(activeTerminal)) {
            await this.stateManager.handleShellDisclaimer()
            return step2Cb && step2Cb()
        }

        this.stateManager.updateState(hasSupportedTerminalKey, true);
        await this.shellHandler.invokeWithCWD((...args) => {
            args.push(step2Cb)
            this.handleDataFolder(...args)
        });

        return true
    }

    handleDataFolder(error, stdout, stderr, cb) {
        const subFolderName = extractCWD(stdout)

        this.dataFolder = this.shellHandler.handleDataPath(
            path.join(os.tmpdir(), rootFolderName, subFolderName + "_out")
        )
        if (!fs.existsSync(this.dataFolder)) fs.mkdirSync(
            this.dataFolder, { recursive: true }
        )
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
        const outputFile = fs.readFileSync(
            this.outputFile,
            this.shellHandler.fileEncoding
        )
        fs.writeFile(
            this.outputFileNoColor,
            removeColors(outputFile),
            { encoding: "utf8" },
            this.outputCB
        )
    }

    getCompletionSummary() {
        const outputFile = fs.readFileSync(this.outputFileNoColor, "utf-8")
        const warnings = getWarnings(outputFile)
        const message = tfCommandSuccess(outputFile)
        return message ? {
            warnings,
            message
        } : outputFile === "" ? noCredentials : errorStatus
    }

    constructor(commandId, averageFromCmd, context, logger, stateManager, shellHandler) {
        this.logger = logger
        this.context = context
        this.initialized = false
        this.outputCB = () => {}
        this.commandId = commandId
        this.firstActivation = false
        this.shellHandler = shellHandler
        this.averageFromCmd = averageFromCmd
        this.stateManager = stateManager
        this.handleDataFolder = this.handleDataFolder.bind(this)
        this.convertOutputToReadable = this.convertOutputToReadable.bind(this)
    }
}

module.exports = { FileHandler }
