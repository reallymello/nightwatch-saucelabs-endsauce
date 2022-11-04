/* eslint-disable no-param-reassign */
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

  after((browser) => {
    browser.end();
  });
});
