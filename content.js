/*Used for checking any password fields in the page.*/


/**
 * Sents pageinfo to the background. (passwordfields, urls)
 */
async function sendPageInfo()
{
    // Checks for passwordfields on the page.
    const passwords = document.querySelectorAll('input[type="password"]');
    
    // Info of the page that will be sent to background.
    let message = {
        command : "addPageInfo",
        url : new URL(window.location.href).hostname,
        hasPasswordField : false
    }

    if(passwords.length != 0)
    {
        message.hasPasswordField = true;
    }
    chrome.runtime.sendMessage(message);
}

/**
 * Refreshes the pop-up, when page becomes visible.
 */
function handleVisibility()
{
    if (!document.hidden){
        sendPageInfo();
    }
}

/**
 * Disables eventlisteners on update.
 */
function disconnect()
{
    console.info("Manager updated. Refresh window or restart Chrome.");
    document.removeEventListener("visibilitychange", handleVisibility);
}


document.addEventListener("visibilitychange", handleVisibility);
chrome.runtime.connect().onDisconnect.addListener(disconnect);


sendPageInfo();
