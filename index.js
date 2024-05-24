const fs = require ('fs');
const http = require ('http');
const url = require ('url')

// const textIn = fs.readFileSync('./final/txt/input.txt', 'utf-8');
// const textOut = `this is about avacado ${textIn}\ncreated on ${Date.now()}`
// console.log (textOut);

// fs.writeFileSync('./final/txt/result.txt', textOut);

// fs.readFile('./final/txt/start.txt','utf-8', (error, data) => {
//     fs.readFile(`./final/txt/${data}.txt`,'utf-8', (error, data1) => {
//         console.log(data1)
//         fs.readFile('./final/txt/append.txt','utf-8', (error, data2) => {
//             fs.writeFile('./final/txt/finalResult.txt', `${data1}\n${data2}`, 'utf-8', error => {
//                 console.log('file has been written');
//             });
//         })
//     })
// })


    const data = fs.readFileSync('./final/dev-data/data.json', 'utf-8')
    const dataObject = JSON.parse(data);

    const tempOverview = fs.readFileSync('./final/templates/template-overview.html', 'utf-8')
    const tempReplace = (temp, product) => {
        let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
         output = output.replace(/{%IMAGE%}/g, product.image);
         output = output.replace(/{%NUTRIENTSNAME%}/g, product.nutrients);
         output = output.replace(/{%QUANTITY%}/g, product.quantity);
         output = output.replace(/{%PRICE%}/g, product.price);
         output = output.replace(/{%ID%}/g, product.id);
         output = output.replace(/{%DESCRIPTION%}/g, product.description);

           
            if(!product.organic) return  output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
         
         return output;

    }
    const tempCard = fs.readFileSync('./final/templates/template-card.html', 'utf-8')
    const tempProduct = fs.readFileSync('./final/templates/template-product.html', 'utf-8')






const server = http.createServer((req, res) => {
    const {pathname, query} = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview'){
        const htmlCards = dataObject.map(el => tempReplace(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', htmlCards)
        res.end(output);

    }
    else if (pathname === '/product'){
    res.writeHead(200, {
        "content-type" : 'text/html'
    })
    const product = dataObject[query.id];
    const output = tempReplace(tempProduct, product)


        res.end(output)
    } else if (pathname === '/api'){
        res.writeHead(200, {
            "content-type" : 'application/json'
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            "Content-type" : "text/html",
            'my-own-header' : 'helloo'
        })
        res.end('<h1>page not found</h1>')
    }
})

server.listen(8000, "127.0.0.1", () => {
    console.log('server is listening on port http://localhost:8000');
})