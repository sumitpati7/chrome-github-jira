function getUrlFromRequest({ query, jiraUrl, ticketNumber } = {}) {
    switch (query) {
        case 'getSession':
            return `https://${jiraUrl}/rest/auth/1/session`;
        case 'getTicketInfo':
            return `https://${jiraUrl}/rest/api/latest/issue/${ticketNumber}`;
        default:
            throw new Error(`Invalid request: ${query}`);
    }
}

async function processRequest(request) {
    const url = getUrlFromRequest(request);

    const response = await fetch(url, {
        headers: { accept: 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    processRequest(request)
        .then(sendResponse)
        .catch(err => {
            console.error(err);
            sendResponse({ error: err.message });
        });

    return true;
});
