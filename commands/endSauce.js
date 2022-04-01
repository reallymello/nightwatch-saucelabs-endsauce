module.exports.command = async function (done) {
    const SauceLabs = require("saucelabs");

    if (this.options.webdriver.host == "localhost") {
        console.info("Test was not run against SauceLabs. Update not required. Exiting endSauce().");
        done();
        return;
    } else if (!this.options.username || !this.options.access_key || !this.options.sauce_region) {
        console.log("Missing one or more SauceLabs configuration options (username, access_key, or sauce_region). Exiting.");
        done();
        return;
    }

    const myAccount = new SauceLabs.default({
        user: this.options.username,
        key: this.options.access_key,
        region: this.options.sauce_region
    })

    var sessionid = this.capabilities['webdriver.remote.sessionid'],
        jobName = this.currentTest.name,
        passed = this.currentTest.results.testcases[jobName].failed === 0,
        groupName = (this.currentTest.group) ? `${this.currentTest.group} - ` : "";

    console.log(`SauceOnDemandSessionID=${sessionid}\r\n` +
        `job-name==${jobName}\r\n` +
        `passed=${passed}\r\n`);

    await myAccount.updateJob(process.env.SAUCE_USERNAME,
        sessionid, {
            passed: passed,
            name: groupName + jobName
        });

    done();
};