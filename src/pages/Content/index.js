let loading = true;
let panelOpen = false;
const isMainUrl = window.location.pathname === '/';
const bubbleHeight = isMainUrl ? '130px' : '165px';

// main -> 110px
// detail -> 145px

// iframe plugin
var iframePlugin = document.createElement('iframe');
iframePlugin.id = 'buidler-plugin-frame';
iframePlugin.style.height = bubbleHeight;
iframePlugin.style.maxHeight = '1080px';
iframePlugin.style.width = '430px';
iframePlugin.frameBorder = 'none';
iframePlugin.style.position = 'fixed';
iframePlugin.style.zIndex = '9000000000000000000';
iframePlugin.style.bottom = '0px';
iframePlugin.style.right = '0px';
iframePlugin.style.opacity = 0;
iframePlugin.style.colorScheme = 'auto';
iframePlugin.onload = () => {
  iframePlugin.style.opacity = 1;
};

// iframe panel
var iframe = document.createElement('iframe');
iframe.id = 'buidler-panel-frame';
iframe.style.height = 'calc(100% - 40px)';
iframe.style.maxHeight = '1080px';
iframe.style.width = '390px';
iframe.style.position = 'fixed';
iframe.style.bottom = '20px';
iframe.style.right = '-390px';
iframe.style.zIndex = '9000000000000000000';
iframe.style.borderRadius = '10px';
iframe.frameBorder = 'none';
iframe.style.transition = 'transform 0.5s ease-out 0s';
iframe.style.transform = 'translateX(0px)';
iframe.style.boxShadow = '8px 8px 20px 0 #00000040';
iframe.style.colorScheme = 'auto';
iframe.onload = () => {};
const toggle = () => {
  const frame = document.getElementById('buidler-panel-frame');
  const pluginFrame = document.getElementById('buidler-plugin-frame');
  if (frame) {
    if (frame.style.transform === 'translateX(0px)') {
      frame.style.transform = 'translateX(calc(-410px))';
    } else {
      frame.style.transform = 'translateX(0px)';
    }
  }
  if (pluginFrame) {
    iframePlugin?.contentWindow?.postMessage?.('toggle-plugin', '*');
  }
};
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg?.type === 'toggle-buidler-extension') {
    if (!loading) {
      toggle();
      panelOpen = !panelOpen;
    }
    response('toggle!!!');
  }
  if (msg?.type === 'on-inject-iframe') {
    const { ottRes } = msg;
    const path = 'plugin';
    let pluginUrl = `https://beta.buidler.app/${path}?external_url=${window.location.href}`;
    if (ottRes?.data) {
      pluginUrl += `&ott=${ottRes?.data}`;
    }
    if (path === 'plugin') {
      iframePlugin.src = pluginUrl;
      document.body.appendChild(iframePlugin);
    } else {
      iframe.src = pluginUrl;
      document.body.appendChild(iframe);
    }
    document.addEventListener('click', function (e) {
      if (panelOpen) {
        iframe.style.transform = 'translateX(0px)';
        panelOpen = false;
      }
    });
    loading = false;
  }
});

if (
  !window.location.origin.includes('community.buidler.app') &&
  !window.location.origin.includes('beta.buidler.app')
) {
  chrome.runtime.sendMessage(
    {
      type: 'on-load',
      url: window.location.href,
    },
    (callback) => {}
  );
}

window.addEventListener('message', (e) => {
  if (e.data.type === 'buidler-plugin-set-cookie') {
    chrome.runtime.sendMessage(e.data, (resCallback) => {
      // handle call back
    });
  }
  if (e.data === 'toggle-panel') {
    toggle();
    panelOpen = !panelOpen;
  }
  if (e.data === 'open-plugin') {
    iframePlugin.style.height = '100vh';
  }
  if (e.data === 'close-plugin') {
    iframePlugin.style.height = bubbleHeight;
  }
  if (e.data === 'open-plugin-menu') {
    iframePlugin.style.height = '580px';
  }
  if (e.data === 'close-plugin-menu') {
    iframePlugin.style.height = '130px';
  }
});
