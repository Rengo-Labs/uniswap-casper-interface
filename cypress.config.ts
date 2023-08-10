import {defineConfig} from "cypress";

const extensionPath = `${__dirname}/cypress/chromeExtension/1.4.1_1`;
export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('before:browser:launch', (browser, launchOptions) => {
                // this line install the Chrome extension
                if (browser.name === 'chrome' || browser.family === 'chromium') {
                    launchOptions.extensions.push(extensionPath)
                    launchOptions.args.push('--auto-open-devtools-for-tabs')
                }
                return launchOptions;
            })
        },
        chromeWebSecurity: false,
        experimentalModifyObstructiveThirdPartyCode: true,
    },
});
