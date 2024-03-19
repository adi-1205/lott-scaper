const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const Result = require('../models').result;

async function fetchAndStorResults(headless = true) {

    let driver

    try {
        let options = new chrome.Options();
        options.addArguments('--headless');
        driver = headless ?
            // OPEN DRIVER IN HEADLESS MODE
            await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build() :
            // OPEN DRIVER WITH BROWSER
            await new Builder().forBrowser('chrome').build();

        let dataSource = [{ _fetch: magnum4dData, name: 'magnum' }, { _fetch: damacaiData, name: 'damacai' }, { _fetch: gdlottoData, name: 'gdlotto' }, { _fetch: ninelottoData, name: 'ninelotto' }]
        let fetchedFrom = {
            magnum: false,
            damacai: false,
            gdlotto: false,
            ninelotto: false
        }

        await tryCatchWraper(dataSource)

        console.log('DATA STORED IN DB');
        console.log(fetchedFrom);

        async function tryCatchWraper(sources) {
            for (let source of sources) {
                console.log('DATA SOURCE', source);
                try {
                    await source._fetch()
                    fetchedFrom[source.name] = true
                } catch (err) {
                    console.log(err.message);
                    console.log('ERROR IN',source.name.toUpperCase());
                }
            }
        }


        async function magnum4dData() {
            await driver.get('https://magnum4d.my/en/results');
            await driver.wait(until.elementLocated(By.css('.result-list.item-list>.d-flex')), 20000)
            let magnumResult = await driver.findElement(By.css('.result-list.item-list>.d-flex'));
            let magnumResultHtml = await magnumResult.getAttribute('outerHTML');
            await Result.create({
                site: 'magnum4d',
                html: magnumResultHtml
            });

        }

        async function damacaiData() {
            await driver.get('https://www.damacai.com.my/past-draw-result/');
            await driver.wait(until.elementLocated(By.className('w3p3d')), 20000)
            let damacaiResult = await driver.findElement(By.className('w3p3d'));
            let damacaiResultHtml = await damacaiResult.getAttribute('outerHTML');
            await Result.create({
                site: 'damacai',
                html: damacaiResultHtml
            });
        }

        async function gdlottoData() {
            await driver.get('https://gdlotto.com/results/today/');
            await driver.wait(until.elementLocated(By.css('#result .col-xl-7.v-bottom')), 20000)
            let gdlottoResult = await driver.findElement(By.css('#result .col-xl-7.v-bottom'));
            let gdlottoResultHtml = await gdlottoResult.getAttribute('outerHTML');
            await Result.create({
                site: 'gdlotto',
                html: gdlottoResultHtml
            });
        }

        async function ninelottoData() {
            let ninelottoResultHtmls = '';
            await driver.get('https://9lotto.com/');
            await driver.wait(until.elementLocated(By.className('result-card')), 20000)
            let ninelottoResult = await driver.findElements(By.className('result-card'));
            for (let _result of ninelottoResult) {
                ninelottoResultHtmls += await _result.getAttribute('outerHTML');
            }
            await Result.create({
                site: 'ninelotto',
                html: ninelottoResultHtmls
            });
        }

    } catch (err) {
        console.log(err);
    } finally {
        if (driver) await driver.quit()
    }

}

module.exports = {
    fetchAndStorResults
}