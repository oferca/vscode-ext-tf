const fs = require('fs');
const os = require('os');
const path = require('path');
const findRemoveSync = require('find-remove');

const {
    timeExt,
    noColorExt,
    errorStatus,
    noCredentials,
    rootFolderName,
    additionalText,
    defaultEstimate,
    hasSupportedTerminalKey
} = require("./shared/constants")

const {
    extractCWD,
    getWarnings,
    removeColors,
    tfCommandSuccess,
    featuresDisabled,
    getLastStateList,
    createOutputFileName,
    calculateAverageDuration
} = require("./shared/methods")

class FileHandler {
    cwd
    mode
    logger
    outputCB
    commandId
    outputFile
    dataFolder
    initialized
    moduleFolder
    averageFromCmd
    completionStatus
    durationEstimate
    completionSummary
    outputFileNotEmpty

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
        const { activeTerminal } = this.stateManager

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

    handleDataFolder(error, stdout, stderr, runCommandCallback) {
        const subFolderName = extractCWD(stdout)
        this.cwd = subFolderName
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
        runCommandCallback()
    }

    get isDefaultDuration() {
        return this.durationEstimate === defaultEstimate
    }

    get outputFileNoColor() {
        const outputFileExt = this.transformOutputColors ? "." + noColorExt : ""
        return this.outputFile + outputFileExt
    }

    getOutputFileContent() {
        return fs.readFileSync(
            this.outputFileNoColor,
            this.shellHandler.fileEncoding
        )
    }

    referUserToTerminal() {
        if (!this.initialized) return
        const content = this.getOutputFileContent()
       fs.writeFileSync(
        this.outputFileNoColor.replaceAll("\n", ""),
        content + "\n " + additionalText || "",
        { encoding: this.shellHandler.fileEncoding || "utf-8"}
        )
    }

    convertOutputToReadable() {
        try {
            const outputFile = fs.readFileSync(
                this.outputFile,
                this.shellHandler.fileEncoding
            )
            const contentNoColors = removeColors(outputFile).replaceAll("/n", "")
            this.updateCompletionsSummary(contentNoColors)
            true && fs.writeFile(
                this.outputFileNoColor,
                contentNoColors,
                { encoding: this.shellHandler.fileEncoding || "utf-8"},
                () => this.outputCB(false, contentNoColors)
            )
        } catch (e) { } // might take some time until file is created
    }

    updateCompletionsSummary(outputFile) {
        if (this.successMessage || typeof outputFile !== "string") return

        const warnings = getWarnings(outputFile)
        this.successMessage = tfCommandSuccess(outputFile)
        const isOutputFileEmpty = outputFile.length < 50 && !this.outputFileNotEmpty
        if (!isOutputFileEmpty) this.outputFileNotEmpty = true

        this.completionSummary = this.successMessage ? {
            warnings,
            message: this.successMessage
        } : (isOutputFileEmpty ? noCredentials : errorStatus)

    }

    get outputFileVSCodePath() {
        return `${this.shellHandler.filePrefix}${this.outputFileNoColor}`
    }

    getStateList() {
        return getLastStateList(this.dataFolder, this.shellHandler.fileEncoding)
    }

    constructor(commandId, averageFromCmd, context, logger, stateManager, shellHandler, transformOutputColors) {
        this.logger = logger
        this.context = context
        this.initialized = false
        this.outputCB = () => { }
        this.commandId = commandId
        this.firstActivation = false
        this.completionStatus = null
        this.stateManager = stateManager
        this.shellHandler = shellHandler
        this.averageFromCmd = averageFromCmd
        this.transformOutputColors = transformOutputColors 
        this.handleDataFolder = this.handleDataFolder.bind(this)
        this.convertOutputToReadable = this.convertOutputToReadable.bind(this)
    }
}

module.exports = { FileHandler }
