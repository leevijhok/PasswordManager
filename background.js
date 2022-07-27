
/**
 * Gets an item from Chrome.storage with a key.
 * @param {String} key Chrome.storage item key.
 * @returns {Promise} Object that corresponds to parameter key.
 */
function getChromeStorageItem(key)
{
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, resolve);
  });
}

/**
 * Gets accounts stored into a local json-object. (Location to change.)
 * @returns {Promise} Object containing all the accounts.
 */
async function getAccountInfo()
{
  const url = chrome.runtime.getURL('accountData.json');
  const object = await fetch(url)
      .then((response) => response)
      .then((json) => {return json});

  return object.json();
}

/**
 * Adds page info into the background. (Whether page has a passwordfield and page url)
 * Changes the icon color based on passwordfield status.
 * @param {Object} message Object that contains all the relevant parameters.
 */
async function addPageInfo(message)
{

  const accounts = await getAccountInfo();

  if(message.hasPasswordField == true && 
      Object.keys(accounts.Accounts).includes(message.url))
  {
    chrome.action.setIcon({path: "images/green-48.png"});
  }
  else if(message.hasPasswordField == true)
  {
    chrome.action.setIcon({path: "images/yellow-48.png"});
  }
  else
  {
    chrome.action.setIcon({path: "images/gray-48.png"});
  }
  
  chrome.storage.sync.set({url: message.url, hasPasswordField : message.hasPasswordField});

}

/**
 * Gets the page info that will be used in the popup.
 * @returns {Promise} A promise containing all the relevant parameters. 
 *                   (Page accounts, passwordfield status, url)
 */
async function getPageInfo()
{
  const url_promise = await getChromeStorageItem('url');
  const pField_promise = await getChromeStorageItem('hasPasswordField');
  let pageStatusInfo = {url : url_promise.url, 
                        pFieldStatus : pField_promise.hasPasswordField, 
                        accounts : []};
  const accounts = await getAccountInfo();
  
  if(Object.keys(accounts.Accounts).includes(pageStatusInfo.url))
  {
    pageStatusInfo.accounts = accounts.Accounts[pageStatusInfo.url];
  }

  return pageStatusInfo;
}

/**
 * Handles request commands made to the background.
 * @param {Object} message Background request command and its parameters.
 * @param {*} sender Not used.
 * @param {Callback} sendResponse Function used for sending an answer to sender.
 * @returns {Boolean} True, regardless of request outcome.
 */
function handleRequest(message,sender,sendResponse)
{
  switch(message.command)
  {
    case "addPageInfo":
      addPageInfo(message);
      getAccountInfo();
      break;
    case "getPageInfo":
      getPageInfo().then( (outcome) => {
        sendResponse(outcome);
      });

      break;
  }
  return true;
}

chrome.runtime.onMessage.addListener(handleRequest);

chrome.runtime.onConnect.addListener(port => port.onDisconnect.addListener(() => chrome.storage.local.clear()));
//chrome.runtime.connect(null, {});