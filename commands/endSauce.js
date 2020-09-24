module.exports.command = async function (done) {
    const SauceLabs = require("saucelabs");

    const myAccount = new SauceLabs.default({
        user: this.options.username,
        key: this.options.access_key,
        region: this.options.sauce_region
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
