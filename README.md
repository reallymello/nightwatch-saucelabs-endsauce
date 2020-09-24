# nightwatch-saucelabs-endsauce
Nightwatch.js custom command for running Nightwatch.js tests against SauceLabs.

## Running your Nightwatch.js tests against SauceLabs' selenium grid

This package will simplify executing and publishing your Nightwatch.js tests and results to SauceLabs, a cloud hosted selenium grid. It does so by placing the after test execution logic to upload the test result to SauceLabs in a custom command that runs in the afterEach test hook. The actual interface to the SauceLabs REST API is provided through dependency (https://www.npmjs.com/package/saucelabs)

## Installation instructions

In your Nightwatch test project 

> npm install nightwatch-saucelabs-endsauce --save

In your Nightwatch nightwatch.json configuration file add or append this entry

> "custom_commands_path": ["./node_modules/nightwatch-saucelabs-endsauce/commands"]

The SauceLabs package looks in the nightwatch.json file for the values it needs to connect to the SauceLabs REST API such as the username, apikey, urls and so forth. Below is an excerpt of the important parts. The desired capabilities section is more to tell SauceLabs the environment you want the test to run under.

The credential values and sauce_region are also used by nightwatch-saucelabs for uploading the test result.

```json
"test_settings": {
    "default": {
      "username": "${SAUCE_USERNAME}",
      "access_key": "${SAUCE_ACCESS_KEY}",
      "sauce_region": "us-west-1",
      "selenium_port": 443,
      "selenium_host": "ondemand.saucelabs.com",
      "use_ssl": true,
      "silent": true,
      "desiredCapabilities": {
        "browserName": "chrome",
        "screenResolution": "1280x1024",
        "browserVersion": "latest",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "timeZone": "New York"
      }
    }
  }
```

## Sending Nightwatch test result to SauceLabs

To close the loop and update the results in your SauceLabs dashboard you will call the endSauce command in the Nightwatch afterEach hook.

Example:

```js
module.exports = {
...
    afterEach: function (browser, done) {
        browser.end();
        browser.endSauce(done);
    }
...
}
```

The endSauce command will update the running test job with the pass or fail status and the name of the test in the format TestClassName - TestName.

*If the browser isn't closed between tests, browser.end, and SauceLabs called in the afterEach I've noticed SauceLabs tends to lump all the tests in a given test class under the name of the test class and hides the results and names of the individual test cases under it. Doing it this way where you close the browser between tests allows each test to be recorded individually.*
