/* eslint-disable no-console */
module.exports = class CustomCommand {
  async command() {
    // eslint-disable-next-line global-require
    const SauceLabs = require('saucelabs');

    let sauceResponse = { status: -1, error: '' };

    try {
      if (this.api.options.webdriver.host === 'localhost') {
        sauceResponse.error =
          'Test was not run against SauceLabs. Update not required. Exiting endSauce().';
        console.info(sauceResponse.error);
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
        sauceResponse.error =
          'Missing one or more SauceLabs configuration options (username or access_key). Exiting.';
        console.error(sauceResponse.error);
        return sauceResponse;
      }

      // eslint-disable-next-line new-cap
      const myAccount = new SauceLabs.default(sauceSettings);
      const sessionid = this.api.sessionId
        ? this.api.sessionId
        : this.api.capabilities['webdriver.remote.sessionid'];
      const jobName = this.api.currentTest.name;
      const passed =
        this.api.currentTest.results.testcases[jobName].failed +
          this.api.currentTest.results.testcases[jobName].errors ===
        0;
      /* const groupName = this.api.currentTest.group
        ? `${this.api.currentTest.group} - `
        : ''; */

      const moduleName = this.api.currentTest.module
        ? `${this.api.currentTest.module} - `
        : '';

      if (!sessionid) {
        sauceResponse.error =
          '❌ browser.sessionId undefined. Ensure endSauce() was called before browser was closed. Test result will not be updated.';
        console.log('\r\n❌ Error calling endSauce()');
        console.error(sauceResponse.error);
        return sauceResponse;
      }

      console.info(
        `\r\nSauceOnDemandSessionID=${sessionid}\r\n` +
          `job-name=${jobName}\r\n` +
          `passed=${passed}\r\n`
      );

      sauceResponse = await myAccount.updateJob(
        /* process.env.SAUCE_USERNAME */ sauceSettings.user,
        sessionid,
        {
          passed,
          name: /* groupName +*/ moduleName + jobName,
        }
      );
    } catch (err) {
      console.error('Error calling SauceLabs updateJob: ', err);
      sauceResponse = {
        status: -1,
        error: err.message,
      };
      return sauceResponse;
    }

    return sauceResponse;
  }
};
