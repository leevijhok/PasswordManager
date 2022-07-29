
/**
 * Makes an table of accounts the user has on the page.
 * @param {Array<Object>} accounts Array of account objects.
 */
function makeTable(accounts)
{
    let table = document.getElementById("table");
    let headRow = document.createElement("tr");

    // Arrays made to lessen the amount code required for the for-loops.
    const headings = ["Username", "E-Mail", "Password", "Updated"];
    const accountHeadings = ["Username", "E-Mail", "Password", "Updated"];

    // Makes table headings.
    for(let i=0; i<headings.length; i++)
    {
        let th = document.createElement("th");
        th.textContent = headings[i];
        headRow.appendChild(th);
    }

    table.appendChild(headRow);

    // Makes the table.
    for(let i=0; i < accounts.length; i++)
    {
        let tr = document.createElement("tr");

        for(let j=0; j < accountHeadings.length; j++)
        {
            let td = document.createElement("td");
            td.textContent = accounts[i][accountHeadings[j]];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

/**
 * Gets the info that will be displayed on the page.
 */
 function getPageInfo()
 {

     chrome.runtime.sendMessage({command : "getPageInfo"}, (response) => {

        let pageUrl = document.getElementById("pageURL");
        let tableHead = document.getElementById("tableHeading");

        // Checks if response is NULL.
        if(Object.keys(response).length == 0 ||
            response.url == undefined || response.accounts == undefined)
        {
            pageUrl.textContent = "NO_URL"
            tableHead.textContent = "Something went wrong. Refresh.";
            return;
        }

        pageUrl.textContent = response.url;

        // Checks if page has an passwordfield and whether person has an account.
        if(response.accounts.length > 0 && response.pFieldStatus == true)
        {
            tableHead.textContent = response.accounts.length + " accounts found."
            makeTable(response.accounts);
        }
        else if(response.pFieldStatus == true)
        {
            tableHead.textContent = "No accounts found";
        }
        else
        {
            tableHead.textContent = "No passwordfields."
        }
        
      });
 }

 document.addEventListener('DOMContentLoaded', function()
 {
    getPageInfo();
 });
