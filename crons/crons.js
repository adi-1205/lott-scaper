const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const Result = require('../models').result;

async function fetchAndStorResults(headless = true) {

    let driver

    try {
        // OPEN DRIVER IN HEADLESS MODE

        let options = new chrome.Options();
        options.addArguments('--headless');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();


        // OPEN DRIVER WITH BROWSER
        // let driver = await new Builder().forBrowser('chrome').build();

        let fetchedFrom = {
            magnum: false,
            damacai: false,
            gdlotto: false,
            ninelotto: false
        }

        try {
            await magnum4dData()
            fetchedFrom.magnum = true
        } catch (err) {
            console.log('ERROR IN MAGNUM');
            console.log(err.msg);
        }
        try {
            await damacaiData()
            fetchedFrom.damacai = true
        } catch (err) {
            console.log('ERROR IN DAMACAI');
            console.log(err.msg);
        }
        try {
            await gdlottoData()
            fetchedFrom.gdlotto = true
        } catch (err) {
            console.log('ERROR IN GDLOTTO');
            console.log(err.msg);
        }
        try {
            await ninelottoData()
            fetchedFrom.ninelotto = true
        } catch (err) {
            console.log('ERROR IN NINELOTTO');
            console.log(err.msg);
        }

        console.log('DATA STORED IN DB');
        console.log(fetchedFrom);


        async function magnum4dData() {

            return new Promise(async (resolve, reject) => {
                try {
                    await driver.get('https://magnum4d.my/en/results');
                    let magnumResult = await driver.findElement(By.css('.result-list.item-list>.d-flex'));
                    let magnumResultHtml = await magnumResult.getAttribute('outerHTML');
                    await Result.create({
                        site: 'magnum4d',
                        html: magnumResultHtml
                    });
                    resolve();
                } catch (err) {
                    console.log('ERROR IN MAGNUM4D');
                    console.log(err);
                    reject(err);
                }
            });
        }

        async function damacaiData() {

            return new Promise(async (resolve, reject) => {
                try {
                    await driver.get('https://www.damacai.com.my/past-draw-result/');
                    let damacaiResult = await driver.findElement(By.className('w3p3d'));
                    let damacaiResultHtml = await damacaiResult.getAttribute('outerHTML');
                    await Result.create({
                        site: 'damacai',
                        html: damacaiResultHtml
                    });
                    resolve();
                } catch (err) {
                    console.log('ERROR IN DAMACAI');
                    console.log(err);
                    reject(err);
                }
            });
        }

        async function gdlottoData() {

            return new Promise(async (resolve, reject) => {
                try {
                    await driver.get('https://gdlotto.com/results/today/');
                    let gdlottoResult = await driver.findElement(By.css('#result .col-xl-7.v-bottom'));
                    let gdlottoResultHtml = await gdlottoResult.getAttribute('outerHTML');
                    await Result.create({
                        site: 'gdlotto',
                        html: gdlottoResultHtml
                    });
                    resolve();
                } catch (err) {
                    console.log('ERROR IN GDLOTTO');
                    console.log(err);
                    reject(err);
                }
            });
        }

        async function ninelottoData() {

            return new Promise(async (resolve, reject) => {
                try {
                    let ninelottoResultHtmls = '';
                    await driver.get('https://9lotto.com/');
                    let ninelottoResult = await driver.findElements(By.className('result-card'));
                    for (let _result of ninelottoResult) {
                        ninelottoResultHtmls += await _result.getAttribute('outerHTML');
                    }
                    await Result.create({
                        site: 'ninelotto',
                        html: ninelottoResultHtmls
                    });
                    resolve();
                } catch (err) {
                    console.log('ERROR IN NINELOTTO');
                    console.log(err);
                    reject(err);
                }
            });
        }

    } catch (err) {
        console.log(err);
    } finally {
        if(driver) await driver.quit()
    }

}

module.exports = {
    fetchAndStorResults
}