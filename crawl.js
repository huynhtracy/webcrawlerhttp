const {JSDOM} = require ('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    //pages is a map of normalizedURL: # of times we have seen the url

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    const normalizedCurrentURL = normalizeURL(currentURL)


    //we only want to crawl pages that are in the same domain
    if(baseURLObj.hostname !== currentURLObj.hostname){
        //console.log('not in same domain')
        return pages
    }


    //if we already have an entry in pages, make an entry
    if (pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }
    //if we don't have an extry, create one
    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling ${currentURL}`)


    try {
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            //client and server error
            console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page ${currentURL}`)
            return pages
        }

        //console.log(await resp.text())
        const htmlBody = await resp.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
            //console.log(nextURL)

        }
        
    }
    catch (err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages  
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        //if it starts with a "/"
        if (linkElement.href.slice(0,1)==='/'){
            //relative url
            try {
                //linkElement.href = linkElement.href.slice(1)
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
    getURLsFromHTML, 
    crawlPage
}

//there is an issue when normalizing URL, or getURL method? 
//the trailing /?
//take another look at these normalize URL methods!
//I think it may be an issue with concatenating?