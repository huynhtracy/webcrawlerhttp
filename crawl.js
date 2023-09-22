const {JSDOM} = require ('jsdom')

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){

        if (linkElement.href.slice(0,1)==='/'){
            //relative url
            try {
                linkElement.href = linkElement.href.slice(1)
                const urlObject = new URL(`${baseURL}${linkElement.href}`)
                urls.push(`${baseURL}${linkElement.href}`)
            }
            catch(err) {
                console.log(`error with relative  url: ${err.message}`)
            }
            
            //console.log(urls)

        }
        else {
            //absolute url

            try {
                const urlObject = new URL(linkElement.href)
                urls.push(urlObject.href)
            }
            catch(err) {
                console.log(`error with relative  url: ${err.message}`)
            }
            
            //console.log(urls)
        }

       
    }

    return urls
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    const hostPath= `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1)==='/'){
        return hostPath.slice(0,-1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}