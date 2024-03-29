const vscode = require('vscode');
const { chatGPTPromptText, emptyPlanTxt, errorsInPlanTxt } = require("../../shared/constants");
const { planSuccessful } = require("../../shared/methods")

const { optimize } = require('./optimize');

class ChatGPTHandler {
    logger
    context

    async execute (source, cb, fileContent) {
        if (!fileContent || fileContent.length < 50) {
            this.logger.log({ message: "failed-chat-gpt" })
            return await vscode.window.showInformationMessage(emptyPlanTxt)
        }
        if (!planSuccessful(fileContent)){
            this.logger.log({ message: "failed-chat-gpt" })
            return await vscode.window.showInformationMessage(errorsInPlanTxt)
        }
        this.logger.log({ message: "opening-chat-gpt" })
        const optimizedContent = optimize(fileContent)
        await vscode.env.clipboard.writeText(optimizedContent)
        await vscode.window.showInformationMessage(chatGPTPromptText,  { modal: true })
        await vscode.env.openExternal(vscode.Uri.parse("https://chat.openai.com/"))
    }

    constructor(context, logger) {
        this.logger = logger
        this.context = context
    }
}

module.exports = { ChatGPTHandler }
