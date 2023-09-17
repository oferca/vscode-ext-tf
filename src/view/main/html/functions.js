module.exports.getFunctions = isExplorer => `
  function launchTFCommand(tfCommand, el) {
    setTimeout(() => {
      const outputArea = document.getElementById("output-file") || demiElement
      const outputAreaFS = document.getElementById("output-file-fs") || demiElement
      if (outputArea.classList.length) outputArea.classList.remove(...outputArea.classList);
      outputAreaFS.classList.remove("matrix");
      outputArea.classList.add("running")
      const mainModal = document.getElementById("main-tf-modal")
    })
    const credentials = getExplorerCredentials()
    el.classList.add('animated-button');

    const message = {
      tfCommand,
      isExplorer: IS_EXPLORER,
      folder: CURRENT_PATH,
      credentials
    }
    vscode.postMessage(message);

    let counter = 0
    const content = document.getElementById("output-file") || demiElement
    content.value = ""
    const pleaseWaitInterval = setInterval(() => {
      const baseContent = "Initializing, please wait..."
      const outputStarted = content.value.indexOf(baseContent) === -1 && content.value.length > baseContent.length + 10
      if (outputStarted) return clearInterval(pleaseWaitInterval)
      let dots = counter == 1 ? "." : ( counter == 2 ? ".." : "")
      content.value = baseContent + dots
      if (counter > 2) counter = 0
      counter++
    }, 600)

    content.style.backgroundImage = "none"
  }

  function postMessageFromWebview(command) {
    const credentials = getExplorerCredentials()

    const message = {
      command,
      isExplorer: IS_EXPLORER,
      folder: CURRENT_PATH,
      credentials
    }
    vscode.postMessage(message);
  }

  function getExplorerCredentials() {
    const explorerCredentials = document.getElementById("credentials")
    if (!explorerCredentials) return
    return document.getElementById("credentials").value
  }

  function incomingMessageHandler(event) {
    const { completionPercentage, outputFileContent } = event.data
    if (completionPercentage) setTimeout(() => updateCompletionPercentage(completionPercentage))
    if (!outputFileContent) return
    const content = document.getElementById("output-file")
    content.value = event.data.outputFileContent
    content.classList.remove("matrix")
    scrollOutputDown()
    content.style.backgroundImage = "none"
    content.style.opacity = "1"
  }

  function removeAnimation () {
    const foldersList = document.getElementById("folders-list")
    if (!foldersList) return
    foldersList.classList.remove("animated")
    foldersList.style.animation = "none"
  }

  function updateCompletionPercentage(completionPercentage) {
    if (completionPercentage < maxPercentage) return
    ${!isExplorer ? "return" : ""}
    maxPercentage = completionPercentage
    const tfProgressBar = document.getElementById("tf-progress")
    tfProgressBar.style = "display: auto;"
    const perc = Math.floor(completionPercentage)
    const progressBar = document.getElementById("progress-bar-bt")
    progressBar.style = "width: "+perc+"%;text-align: right;"
    progressBar.setAttribute("aria-valuenow", perc)
    progressBar.innerHTML = perc+"%"
  }

  function scrollOutputDown(animated = true) {
    if (scrollInterval) return

    const content = document.getElementById("output-file")
    if (!content) return
    const animatedScroll = () => {
      currentScrollTop = currentScrollTop + 2;
      content.scrollTop = currentScrollTop
      if (currentScrollTop < content.scrollHeight) return
      clearInterval(scrollInterval)
      scrollInterval = undefined
    }

    if (animated) scrollInterval = setInterval(animatedScroll, 0.25)
    if (!animated) content.scrollTop = content.scrollHeight

    if (!content.value || content.value.length < 60) return
    content.style.backgroundImage = "none"
    content.style.opacity = "1"
  }
  function scrollToCheckbox() {
    const checkbox = document.getElementById("myCheckbox")
    if (checkbox) checkbox.scrollIntoView({ behavior: "smooth" })
  }
  function initAccordions () {
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.height === "200px") {
            panel.style.height = "0px"
        } else {
            panel.style.height = "200px"
        }
        });
    }
    }
`