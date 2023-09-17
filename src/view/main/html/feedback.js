const snackbar = (msg, type, planSuccess) => {
  const chatGPT = planSuccess ? ` <br>Or see ChatGPT Synopsis in <i onclick=\\"postMessageFromWebview('chat-gpt', IS_EXPLORER)\\"><u class=\\"logs\\">OpenAI Chat</u></i>.` : ""
  const message = msg + ` <br><i onclick=\\"postMessageFromWebview('openOutputFile', IS_EXPLORER)\\"><u class=\\"logs\\">Examine Terraform Output Logs</u></i>.` + chatGPT
  return `var x = document.getElementById("snackbar");x.innerHTML="${message}";x.classList.add("show", "${type}");setTimeout(function(){ x.classList.remove("show"); }, 300000);document.body.onclick = () => { x.remove(); const outputArea = document.getElementById("output-file") || demiElement; outputArea.classList.remove(...outputArea.classList); }`
}

module.exports.success = (msg, planSuccess) => snackbar(msg, "success", planSuccess)

module.exports.warning = (msg, planSuccess) => snackbar(msg, "warning", planSuccess)

module.exports.error = msg => snackbar(msg, "error")

module.exports.info = (msg, planSuccess) => snackbar(msg, "info", planSuccess)
