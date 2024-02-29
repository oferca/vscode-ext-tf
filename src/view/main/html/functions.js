module.exports.getFunctions = (isExplorer, notifiedJson) => `
  function launchTFCommand(tfCommand, el) {
    setTimeout(() => {
      const outputArea = document.getElementById("output-file") || demiElement
      const outputAreaFS = document.getElementById("output-file-fs") || demiElement
      if (outputArea.classList.length) outputArea.classList.remove(...outputArea.classList);
      outputAreaFS.classList.remove("shine");
      // outputArea.classList.add("running")
      const mainModal = document.getElementById("main-tf-modal")
    })
    el.classList.add('animated-button');

    const message = {
      tfCommand,
      isExplorer: IS_EXPLORER,
      folder: CURRENT_PATH,
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
    const buttonsPulse = document.querySelector(".button-pulse")
    if (!buttonsPulse) return
    Object.keys(buttonsPulse).forEach(el => buttonsPulse[el].classList.remove("button-pulse"))
  }

  function postMessageFromWebview(command) {
    const message = {
      command,
      isExplorer: IS_EXPLORER,
      folder: CURRENT_PATH,
    }
    vscode.postMessage(message);
  }

  function incomingMessageHandler(event) {
    const { completionPercentage, outputFileContent } = event.data
    if (completionPercentage) setTimeout(() => updateCompletionPercentage(completionPercentage))
    if (!outputFileContent) return
    const content = document.getElementById("output-file")
    content.value = event.data.outputFileContent.replace("\\n", "")
    content.classList.remove("shine")
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
    const checkbox = document.getElementById("topPixel")
    if (checkbox) checkbox.scrollIntoView({ behavior: "smooth" })
  }
  function initAccordions () {
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        const actualHeight = "133px"
        if (panel.style.height === actualHeight) {
            panel.style.height = "0px"
        } else {
            panel.style.height = actualHeight
        }
        });
    }
  }

  function showInteractiveInstructions(projectName) {

  let text = [
    "Enter cloud credentials for \\\"" + projectName + "\\\" environment in terminal below ↓ as you would normally.",
    "Then click a terraform command button in popup.",
    "Watch for output in terminal and window.",
    "To re-open command center, type '⌘⇧T' ( control / command + shift + T ).",
    "Or        ",
    "Click \\\"Terraform Projects\\\" button in status bar."
  ]
    document.querySelector(".msg-icn").style.display = "inline-block"
    const notifiedRaw = JSON.parse('${notifiedJson}')
    const notified = Object.keys(notifiedRaw)
    if(notified.length > 0) text = [
      "Enter cloud credentials for \\\"" + projectName + "\\\" environment in terminal below ↓"
    ]
    const projectNotificationStatus = notified.find(n => n.indexOf(projectName) > -1) 
    console.log("notifiedRaw", notifiedRaw, notifiedRaw[projectNotificationStatus])
    if (projectNotificationStatus && notifiedRaw[projectNotificationStatus] === null) {
      document.querySelector(".msg-icn").style.display = "none";
      return
    }
    const typSpd = 70; 
    const waitTime = 500;
    
    var mi = 0;
    
    function writeString(e, str, i) {
      e.innerHTML = e.innerHTML + str[i];
      
      if (e.innerHTML.length == str.length && mi != text.length)
        setTimeout(slowlyDelete, waitTime, e);
    }
    
    function deleteString(e) {
      e.innerHTML = e.innerHTML.substring(0, e.innerHTML.length - 1);
      
      if (e.innerHTML.length == 0)
        slowlyWrite(e, text[mi++]);
    }
    
    function slowlyDelete(e) {
      for (var i = 0; i < e.innerHTML.length; i++) {
        setTimeout(deleteString, typSpd / 2 * i, e);
      }
    }
    
    function slowlyWrite(e, str) {
      for (var i = 0; i < str.length; i++) {
        setTimeout(writeString, typSpd * i, e, str, i);
      }
    }

    const msg = document.querySelector(".msg-icn");
    if (msg) {
      slowlyDelete(msg);
    }
    
    const msgCredentials = document.querySelector(".enter-credentials");
    if (msgCredentials) {
      slowlyDelete(msgCredentials, 1);
    }
    
  }
`