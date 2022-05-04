module.exports = class CustomCommand {
  async command() {
    const SauceLabs = require('saucelabs');

    let sauceResponse;

    try {
      if (this.api.options.webdriver.host == 'localhost') {
        console.info(
          'Test was not run against SauceLabs. Update not required. Exiting endSauce().'
        );
        return sauceResponse;
      }

      // In Nightwatch 2.0 the convention is moving toward sauce:options
      // Getting value from there first and falling back to options collection if missing
      const sauceOptions =
        this.api.options.desiredCapabilities['sauce:options'] || {};
      const sauceSettings = {
        user: sauceOptions.username
          ? sauceOptions.username
          : this.api.options.username,
        key: sauceOptions.accessKey
          ? sauceOptions.accessKey
          : this.api.options.access_key,
        region: sauceOptions.region
          ? sauceOptions.region
          : this.api.options.sauce_region,
      };

      if (!sauceSettings.user || !sauceSettings.key) {
        console.error(
          'Missing one or more SauceLabs configuration options (username or access_key). Exiting.'
        );
        return sauceResponse;
      }

      const myAccount = new SauceLabs.default(sauceSettings);

      var sessionid = this.api.sessionId
          ? this.api.sessionId
          : this.api.capabilities['webdriver.remote.sessionid'],
        jobName = this.api.currentTest.name,
        passed =
          this.api.currentTest.results.testcases[jobName].failed +
            this.api.currentTest.results.testcases[jobName].errors ===
          0,
        groupName = this.api.currentTest.group
          ? `${this.api.currentTest.group} - `
          : '';

      if (!sessionid) {
        console.log('\r\n❌ Error calling endSauce()');
        console.error(
          '❌ browser.sessionId undefined. Ensure endSauce() was called before browser was closed. Test result will not be updated.'
        );
        return sauceResponse;
      }

      console.log(
        `SauceOnDemandSessionID=${sessionid}\r\n` +
          `job-name==${jobName}\r\n` +
          `passed=${passed}\r\n`
      );

      sauceResponse = await myAccount.updateJob(
        /*process.env.SAUCE_USERNAME*/ sauceSettings.user,
        sessionid,
        {
          passed: passed,
          name: groupName + jobName,
        }
      );
    } catch (err) {
      console.error('Error calling SauceLabs updateJob: ', err);
      sauceResponse = {
        status: -1,
        error: err.message,
      };
    }

    return sauceResponse;
  }
};
