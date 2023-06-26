/* eslint-disable no-console */
module.exports = class CustomCommand {
  async command() {
    if (this.api.options.webdriver.host === 'localhost') {
      console.info(
        'Test was not run against SauceLabs. Update not required. Exiting endSauce().'
      );
      return;
    }

    // In Nightwatch 2.0 the convention is moving toward sauce:options
    // Getting value from there first and falling back to options collection if missing
    const sauceOptions =
      this.api.options.desiredCapabilities['sauce:options'] || {};
    const sauceVisualOptions =
      this.api.options.desiredCapabilities['sauce:visual'] || {};
    const sauceSettings = {
      user: sauceOptions.username || this.api.options.username,
      key:
        sauceOptions.accessKey ||
        sauceOptions.access_key ||
        this.api.options.access_key,
      region: sauceOptions.region || this.api.options.sauce_region,
      visualKey: sauceVisualOptions.apiKey || this.api.options.apiKey,
    };

    if (
      (!sauceSettings.user || !sauceSettings.key) &&
      !sauceSettings.visualKey
    ) {
      console.error(
        'Missing one or more SauceLabs configuration options (username or access_key). Exiting.'
      );
      return;
    }

    const jobName = this.api.currentTest.name;
    const moduleName = this.api.currentTest.module
      ? `${this.api.currentTest.module} - `
      : '';
    const passed =
      this.api.currentTest.results.testcases[jobName].failed +
        this.api.currentTest.results.testcases[jobName].errors ===
      0;
    await this.api.execute(`sauce:job-result=${passed}`);
    await this.api.execute(`sauce:job-name=${moduleName + jobName}`);
  }
};
