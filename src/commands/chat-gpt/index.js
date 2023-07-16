const vscode = require('vscode');
const { chatGPTQueryText, chatGPTPromptText, emptyPlanTxt } = require("../../shared/constants");
const { optimize } = require('./optimize');

class ChatGPTHandler {
    logger
    context

    async execute (source, cb, fileContent) {
        if (!fileContent || fileContent.length < 50) {
            this.logger.log({ msg: "failed-chat-gpt", source })
            return await vscode.window.showInformationMessage(emptyPlanTxt)
        }
        this.logger.log({ msg: "chat-gpt", source: "webview"})
        const optimizedContent = optimize(fileContent)
        await vscode.env.clipboard.writeText(chatGPTQueryText + optimizedContent)
        await vscode.window.showInformationMessage(chatGPTPromptText,  { modal: true })
        await vscode.env.openExternal(vscode.Uri.parse("https://chat.openai.com/"))
    }

    constructor(context, logger) {
        this.logger = logger
        this.context = context
    }
}

module.exports = { ChatGPTHandler }
