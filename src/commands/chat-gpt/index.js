const vscode = require('vscode');
const { chatGPTQueryText, chatGPTPromptText, emptyPlanTxt } = require("../../shared/constants")

class ChatGPTHandler {
    logger
    context

    async execute (source, cb, outputFileContent) {
        if (!outputFileContent || outputFileContent.length < 50) {
            this.logger.log({ msg: "failed-chat-gpt", source })
            return await vscode.window.showInformationMessage(emptyPlanTxt)
        }
        this.logger.log({ msg: "chat-gpt", source: "webview"})
        await vscode.env.clipboard.writeText(chatGPTQueryText + outputFileContent)
        await vscode.window.showInformationMessage(chatGPTPromptText,  { modal: true })
        await vscode.env.openExternal(vscode.Uri.parse("https://chat.openai.com/"))
    }

    constructor(context, logger) {
        this.logger = logger
        this.context = context
    }
}

module.exports = { ChatGPTHandler }
