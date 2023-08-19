const snackbar = (msg, type) => `var x = document.getElementById("snackbar");x.innerHTML="${msg}";x.classList.add("show", "${type}");setTimeout(function(){ x.classList.remove("show"); }, 300000);document.body.onclick = () => x.remove();`

module.exports.success = msg => snackbar(msg, "success")

module.exports.warning = msg => snackbar(msg, "warning")

module.exports.error = msg => snackbar(msg, "error")

module.exports.info = msg => snackbar(msg, "info")
