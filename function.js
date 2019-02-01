//saved stock list
const stockList = [];


//append block containing fetched stock data, called by pullStockInfo
const render = function (infoBox) {
    const template = $("<div>");
    template.addClass("col-sm-6");
    template.append(infoBox);
    $("#infoSection").append(template);
    return;
}

//create block containing fetched stock data, used in render
const infoBoxCreator = function (logo, name, price, news) {
    const template = $("<div>");
    template.addClass("infoBox");
    const companyLogo = `<img src="${logo}" alt="logo" class="logo"/>`;
    const companyName = `<h1 class="companyName">${name}</h1>`;
    const stockPrice = `<h2 class="stockPrice">Latest Price: $${price}</h2>`;


    template.append(`${companyLogo}${companyName}${stockPrice}`);
    for (let i = 0; i < news.length; i++) {
        console.log(news[i]);
        const singleBlock = $("<a>");
        const headline = `<h3 class="headline">${news[i].headline}</h3>`;
        const source = `<h4 class="source">Source: ${news[i].source}</h4>`;
        const summary = `<p class="summary">Summary: ${news[i].summary}</p2>`;
        const url = news[i].url;
        singleBlock.attr("href", `${url}`);
        singleBlock.append(`${headline}${source}${summary}`);
        template.append(singleBlock);
    }

    return template;

}

//execute on stock button click, fetch and pass data from api to infoBoxCreator which are then used in render
const pullStockInfo = function () {
    const symbol = $(this).attr("data-name");
    const domainURL = `https://api.iextrading.com/1.0/stock/`;
    const stockEP = `${symbol}/batch?types=quote,news,logo&last=10`;

    $.ajax({
        url: `${domainURL}${stockEP}`,
        method: "GET"
    }).then(function (response) {
        const logo = response.logo.url;
        const name = response.quote.companyName;
        const price = response.quote.latestPrice;
        const news = response.news;
        render(infoBoxCreator(logo, name, price, news));

    })
}

//execute on add button click, fetch symbol list from api and compare user input to list, if match found, push 
//symbol to stockList then render stockList as individual buttons to the page, each with unique attribute of data name.
const addButton = function () {
    event.preventDefault();
    const symbol = $("#searchBar").val().trim();
    $.ajax({
        url: "https://api.iextrading.com/1.0/ref-data/symbols",
        method: "GET"
    }).then(function (response) {
        response.forEach(function (list) {
            if (list.symbol.toUpperCase() == symbol.toUpperCase()) {
                    $("#buttonBar").empty();
                stockList.push(symbol);
                stockList.forEach(function (symbol) {
                    const newButton = $(`<button>`);
                    newButton.addClass("stockButtons btn btn-info btn-sm");
                    newButton.attr("data-name", symbol);
                    newButton.text(symbol);
                    $("#buttonBar").append(newButton);
                })
            }
        })
    })

}


//listeners
$("#searchButton").click(addButton);

$("#buttonBar").on("click", ".stockButtons", pullStockInfo);
