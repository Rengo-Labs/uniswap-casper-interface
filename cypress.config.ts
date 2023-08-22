import {defineConfig} from "cypress";
import axios from "axios";
import puppeteer from "puppeteer";

const extensionPath = `${__dirname}/cypress/chromeExtension/1.4.1_1`;
let debuggingPort = null;
const extensionOnboardingURL = 'chrome-extension://abkahkcbhngaebpcgfmhkoioedceoigp/onboarding.html';
const extensionPopupURL = 'chrome-extension://abkahkcbhngaebpcgfmhkoioedceoigp/popup.html';
const walletPassword = 'qwertyuiopasdfgh';
const walletRecoveryPhrase = 'harsh erase expand economy benefit ready coffee excite friend beach never stem card science hub problem oyster setup harsh prefer cable front finger heavy';
async function setOnboarding() {
    if (debuggingPort != null) {
        const url = `http://127.0.0.1:${debuggingPort}/json/version`;
        const { data: debuggerInfo } = await axios.get(url);
        const browser = await puppeteer.connect({
            browserWSEndpoint: debuggerInfo.webSocketDebuggerUrl,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();

        await page.goto(extensionOnboardingURL, {
            waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
        });
        // first screen - Init
        await page.waitForSelector('button');
        await page.click('button');
        await page.waitForNavigation();
        // second screen - Create password
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', walletPassword);
        await page.waitForSelector('input[name="confirmPassword"]');
        await page.type('input[name="confirmPassword"]', walletPassword);
        await page.waitForSelector('div[data-testid="terms-checkbox"]');
        await page.click('div[data-testid="terms-checkbox"]');
        await page.waitForSelector('button');
        await page.click('button');
        await page.waitForNavigation();
        // third screen - Recovery phrase
        await page.waitForSelector('button');
        await page.click('button:nth-child(2)');
        await page.waitForNavigation();
        // fourth screen - Confirm recovery phrase
        await page.waitForSelector('textarea');
        await page.type('textarea', walletRecoveryPhrase);
        await  page.waitForSelector('button');
        await page.click('button');
        await page.waitForNavigation();

        return page;
    } else {
        throw new Error('debuggingPort not provided');
    }
}

async function setPassword() {
    if (debuggingPort != null) {
        const url = `http://127.0.0.1:${debuggingPort}/json/version`;
        const { data: debuggerInfo } = await axios.get(url);
        const browser = await puppeteer.connect({
            browserWSEndpoint: debuggerInfo.webSocketDebuggerUrl,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();
        await page.goto(extensionPopupURL, {
            waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
        });
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', walletPassword);
        await page.click('button[type="submit"]');
        return page;
    } else {
        throw new Error('debuggingPort not provided');
    }
}

async function signContract() {
    if (debuggingPort != null) {
        const url = `http://127.0.0.1:${debuggingPort}/json/version`;
        const { data: debuggerInfo } = await axios.get(url);
        const browser = await puppeteer.connect({
            browserWSEndpoint: debuggerInfo.webSocketDebuggerUrl,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();
        await page.goto(extensionPopupURL, {
            waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
        });

        // selector for signing contract
        const openTabs = await browser.targets();
        const globalPage = openTabs.map((page) => {
            console.log('#### page @@@', page)
            return page.page()
        })
        console.log('#### globalPage @@@', globalPage)

        return page;
    } else {
        throw new Error('debuggingPort not provided');
    }
}


export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('before:browser:launch', (browser, launchOptions) => {
                if (browser.name === 'chrome' || browser.family === 'chromium') {
                    // this line install the Chrome extension
                    launchOptions.extensions.push(extensionPath)
                    // launchOptions.args.push('--auto-open-devtools-for-tabs')

                    const RDP = launchOptions.args.find(
                        arg => arg.slice(0, 23) === '--remote-debugging-port',
                    );
                    debuggingPort = RDP.split('=')[1];
                }

                return launchOptions;
            })
            on('task', {
                setOnboarding,
            })
            on('task', {
                setPassword,
            })
            on('task', {
                signContract,
            })
        },
        chromeWebSecurity: false,
        experimentalModifyObstructiveThirdPartyCode: false,
        // TODO change to true if we need to record video
        video: false,
        baseUrl: 'https://casperswap-integration-net-git-feat-staking-system-rengolabs.vercel.app',
        testIsolation: false,
    },
});
