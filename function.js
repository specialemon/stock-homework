const stockList = [];

const render = function (infoBox) {
    const template = $("<div>");
    template.addClass("col-sm-6");
    template.append(infoBox);
    $("#infoSection").append(template);
    return;
}

const infoBoxCreator = function (logo, name, price, news) {
    const template = $("<div>");
    template.addClass("infoBox");
    const companyLogo = `<img src="${logo}" alt="logo" class="logo"/>`;
    const companyName = `<h1 class="companyName">${name}</h1>`;
    const stockPrice = `<h2 class="stockPrice">Latest Price: $${price}</h2>`;
    // const companyNews = newsCreator(news);


    template.append(`${companyLogo}${companyName}${stockPrice}`);
    for (let i = 0; i < news.length; i++) {
        console.log(news[i]);
        const singleBlock = $("<a>");
        const headline = `<h3 class="headline">${news[i].headline}</h3>`;
        const source = `<h4 class="source">Source: ${news[i].source}</h4>`;
        const summary = `<p class="summary">${news[i].summary}</p2>`;
        const url = news[i].url;
        singleBlock.attr("href", `${url}`);
        singleBlock.append(`${headline}${source}${summary}`);
        template.append(singleBlock);
    }

    return template;

}

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

$("#searchButton").click(addButton);

$("#buttonBar").on("click", ".stockButtons", pullStockInfo);
