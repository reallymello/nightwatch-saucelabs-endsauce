/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const SauceLabs = require('saucelabs');
const assert = require('assert');

describe('When called with valid config', () => {
  this.tags = ['happyPath'];

  before((browser) => browser.navigateTo('https://www.davidmello.com/'));

  it('Passing test should return in progress and passed', async (browser) => {
    browser.waitForElementVisible('body').assert.titleContains('David Mello');

    const result = await browser.endSauce();
    assert.equal(result.status, 'in progress');
    assert.equal(result.passed, true);
  });

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

    assert.equal(
      jobResponse.name,
      'endToEndTests - Can use sauce script to update test status and name'
    );
  });

  after((browser) => {
    browser.end();
  });
});
