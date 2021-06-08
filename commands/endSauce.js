module.exports.command = async function (done) {
    const SauceLabs = require("saucelabs");

    if (this.options.webdriver.host == "localhost") {
        console.info("Test was not run against SauceLabs. Update not required. Exiting endSauce().");
        done();
        return;
    } else if (!this.options.webdriver.username || !this.options.webdriver.access_key) {
        console.log("Missing one or more SauceLabs configuration options. Exiting.");
        done();
        return;
    }

    const myAccount = new SauceLabs.default({
        user: this.options.webdriver.username,
        key: this.options.webdriver.access_key,
        region: this.options.webdriver.sauce_region
    });

    var sessionid = this.capabilities['webdriver.remote.sessionid'],
        jobName = this.currentTest.name,
        passed = this.currentTest.results.testcases[jobName].failed === 0,
        groupName = this.currentTest.group;

    console.log(`SauceOnDemandSessionID=${sessionid}\r\n` +
        `job-name==${jobName}\r\n` +
        `passed=${passed}\r\n`);

    await myAccount.updateJob(process.env.SAUCE_USERNAME,
        sessionid, {
            passed: passed,
            name: `${groupName} - ${jobName}`
        });

    done();
};
