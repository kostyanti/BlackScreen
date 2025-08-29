chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.statusCode === 200 && details.url.endsWith("hls:manifest.m3u8")) {
      chrome.tabs.sendMessage(details.tabId, {
        type: "logRequest",
        method: details.method,
        url: details.url,
        status: details.statusCode
      });
    }
  },
  { urls: ["<all_urls>"] }
);
