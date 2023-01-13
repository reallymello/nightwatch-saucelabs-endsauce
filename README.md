# nightwatch-saucelabs-endsauce

Nightwatch.js custom command for running Nightwatch.js tests against SauceLabs.

[![Node.js CI](https://github.com/reallymello/nightwatch-saucelabs-endsauce/actions/workflows/node.js.yml/badge.svg)](https://github.com/reallymello/nightwatch-saucelabs-endsauce/actions/workflows/node.js.yml)

- [Example repository](https://github.com/reallymello/nightwatchTutorials/tree/master/sauceLabsExample)
- Article - [How to use SauceLabs with Nightwatch](https://www.davidmello.com/how-to-use-nightwatch-with-saucelabs/)

## Running your Nightwatch.js tests against SauceLabs' selenium grid

This package will simplify executing and publishing your Nightwatch.js tests and results to SauceLabs, a cloud hosted selenium grid. It does so by placing the after test execution logic to upload the test result to SauceLabs in a custom command that runs in the afterEach test hook. The actual interface to the SauceLabs REST API is provided through dependency (https://www.npmjs.com/package/saucelabs)

## Installation instructions

In your Nightwatch test project

> npm install nightwatch-saucelabs-endsauce --save

In your Nightwatch configuration file (nightwatch.conf.js or nightwatch.json) add or append this entry depending on your Nightwatch version

Nightwatch versions >= 2.0 [Plugin Pattern](https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html#guide-container)

> "plugins": ["nightwatch-saucelabs-endsauce"]

Nightwatch versions older than 2.0 (or if you prefer using custom_commands_path over plugins):

>**If you are upgrading from a 1.x version of nightwatch-saucelabs-endsauce please note the new directory path below. This will need to be updated if you want to continue using the custom_commands_path style of importing**

> "custom_commands_path": ["./node_modules/nightwatch-saucelabs-endsauce/nightwatch/commands"]

_Use either the `plugins` setting or `custom_commands_path`, not both._

The SauceLabs package looks in the nightwatch.conf.js file for the values it needs to connect to the SauceLabs REST API such as the username, apikey, urls and so forth. Below is an excerpt of the important parts. The desired capabilities section is more to tell SauceLabs the environment you want the test to run under.

The credential values and sauce_region are also used by nightwatch-saucelabs for uploading the test result.

For Nightwatch versions < 2.0

```js
"test_settings": {
    "default": {
      "username": "${SAUCE_USERNAME}",
      "access_key": "${SAUCE_ACCESS_KEY}",
      "sauce_region": "us-west-1",
      "selenium": {
        "port": 443,
        "host": "ondemand.saucelabs.com",
        "start_process": false
      },
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

For Nightwatch versions > 2.0 the pattern seems to be moving the values under desiredCapabilities within sauce:options.

```js
"test_settings": {
    "default": {
      "selenium": {
        "port": 443,
        "host": "ondemand.saucelabs.com",
        "start_process": false
      },
      "use_ssl": true,
      "silent": true,
      "desiredCapabilities": {
        "sauce:options" : {
          "username": "${SAUCE_USERNAME}",
          "accessKey": "${SAUCE_ACCESS_KEY}",
          // https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/#--region
          // "region": "us-west-1",
          // https://docs.saucelabs.com/dev/test-configuration-options/#tunnelidentifier
          // "parentTunnel": ""
          // "tunnelIdentifier": ""
        },
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

### TypeScript Support

If you are working in a TypeScript project you may notice the `.endSauce()` command is not available on the browser object types by default. To import the types you can do one of the following. Option 1 is preferred.

**Option 1**, add `types": ["nightwatch-saucelabs-endsauce"]` to your tsconfig.json under compilerOptions

Example:
```json
"compilerOptions": {
  "types": ["nightwatch-saucelabs-endsauce"],
}
```

**Option 2**, in a test you can add `import 'nightwatch-saucelabs-endsauce'`

**Option 3**, manually add the definition to the Nightwatch browser types add a file called `nightwatch.d.ts` in the root of your tests folder with these contents inside.

Example:
```ts
// nightwatch.d.ts
import { NightwatchAPI, Awaitable } from 'nightwatch';

declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
    endSauce(): Awaitable<NightwatchAPI, any>;
  }
}
```

## Sending Nightwatch test result to SauceLabs

To close the loop and update the results in your SauceLabs dashboard you will call the endSauce command in the Nightwatch afterEach hook.

_In Nightwatch versions >= 2.0 ensure browser.endSauce() is called before calling browser.end()._

Example:

```js
module.exports = {
...
    afterEach: function (browser) {
        browser.endSauce();
        browser.end();
    }
...
}
```

The endSauce command will update the running test job with the pass or fail status and the name of the test in the format TestClassName - TestName.

More information about [running Nightwatch with SauceLabs](https://www.davidmello.com/how-to-use-nightwatch-with-saucelabs/)

_If the browser isn't closed between tests, browser.end, and SauceLabs called in the afterEach I've noticed SauceLabs tends to lump all the tests in a given test class under the name of the test class and hides the results and names of the individual test cases under it. Doing it this way where you close the browser between tests allows each test to be recorded individually._
