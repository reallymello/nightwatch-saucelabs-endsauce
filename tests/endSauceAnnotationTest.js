/* eslint-disable no-undef */
const SauceLabs = require('saucelabs');
const assert = require('assert');

describe('When called with valid config', () => {
  this.tags = ['happyPath'];

  before((browser) => browser.navigateTo('https://www.davidmello.com/'));

  it('Can use sauce script to update test status and name', async (browser) => {
    // eslint-disable-next-line new-cap
    const myAccount = new SauceLabs.default({
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
    });

    await browser
      .waitForElementVisible('body')
      .assert.titleContains('David Mello');
    await browser.endSauceAnnotation();

    const sauceResponse = await myAccount.listJobs(process.env.SAUCE_USERNAME);
    const jobId = sauceResponse.jobs[0].id;
    const jobResponse = await myAccount.getJob(
      process.env.SAUCE_USERNAME,
      jobId
    );

    assert.equal(jobResponse.status, 'in progress');
    assert.equal(
      jobResponse.name,
      'endSauceAnnotationTest - Can use sauce script to update test status and name'
    );
    //console.log(JSON.stringify(jobResponse));
  });

  after((browser) => {
    browser.end();
  });
});
