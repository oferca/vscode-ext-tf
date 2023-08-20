const snackbar = (msg, type) => {
  const message = msg + ` <br>See logs in terminal and in <i onclick=\\"postMessageFromWebview('openOutputFile', IS_EXPLORER)\\"><u class=\\"logs\\">Terraform Output Logs</u></i>.`
  return `var x = document.getElementById("snackbar");x.innerHTML="${message}";x.classList.add("show", "${type}");setTimeout(function(){ x.classList.remove("show"); }, 300000);document.body.onclick = () => { x.remove(); const outputArea = document.getElementById("output-file") || demiElement; outputArea.classList.remove(...outputArea.classList); }`
}

module.exports.success = msg => snackbar(msg, "success")

module.exports.warning = msg => snackbar(msg, "warning")

module.exports.error = msg => snackbar(msg, "error")

module.exports.info = msg => snackbar(msg, "info")
