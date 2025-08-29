chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "logRequest") {
    sessionStorage.setItem("videoUrl", JSON.stringify(message.url));
  }
});
