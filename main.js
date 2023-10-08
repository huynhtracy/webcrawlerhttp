const {crawlPage} = require('./crawl.js')
const {printReport} = require('./report.js')


async function main(){
    if (process.argv.length < 3){
        //why length 3?
        console.log("no website provided")
        process.exit(1)
    }

    if(process.argv.length > 3){
        console.log("too many command line args")
        process.exit(1)
    }

    //what are the 3 args in process.argv? 
    //1. name of profram (node)
    //2. name of our code (main.js)
    //3. the url we are passing to the program

    //the 3rd element is the url so
    const baseURL = process.argv[2]

    console.log(`starting crawl of ${baseURL}`)
    const pages = await crawlPage(baseURL, baseURL, {})

    printReport(pages)
    // for(const page of Object.entries(pages)){
    //     console.log(page)
    // }
}

main()