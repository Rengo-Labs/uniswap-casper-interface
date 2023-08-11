import {defineConfig} from "cypress";
import axios from "axios";
import puppeteer from "puppeteer";

const extensionPath = `${__dirname}/cypress/chromeExtension/1.4.1_1`;
let debuggingPort = null;
// const extensionURL = 'chrome-extension://abkahkcbhngaebpcgfmhkoioedceoigp/onboarding.html';
const extensionURL = 'chrome-extension://abkahkcbhngaebpcgfmhkoioedceoigp/popup.html';

async function setBrowser() {
    if (debuggingPort != null) {
        const url = `http://127.0.0.1:${debuggingPort}/json/version`;
        const { data: debuggerInfo } = await axios.get(url);
        const browser = await puppeteer.connect({
            browserWSEndpoint: debuggerInfo.webSocketDebuggerUrl,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();

        await page.goto(extensionURL, {
            waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
        });

    } else {
        throw new Error('debuggingPort not provided');
    }

    return null;
}
export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('before:browser:launch', (browser, launchOptions) => {
                // this line install the Chrome extension
                if (browser.name === 'chrome' || browser.family === 'chromium') {
                    launchOptions.extensions.push(extensionPath)
                    launchOptions.args.push('--auto-open-devtools-for-tabs')

                    const RDP = launchOptions.args.find(
                        arg => arg.slice(0, 23) === '--remote-debugging-port',
                    );
                    debuggingPort = RDP.split('=')[1];
                }

                return launchOptions;
            })
            on('task', {
                setBrowser,
            })
        },
        chromeWebSecurity: false,
        experimentalModifyObstructiveThirdPartyCode: true,
    },
});
