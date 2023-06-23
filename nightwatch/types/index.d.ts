import { NightwatchAPI, Awaitable } from 'nightwatch';

declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
    /**
     * When called from the afterEach test hook endSauce will update the temporary test run name
     * and status in the SauceLabs portal with the name of the actual test and the pass or fail
     * status of the it.
     * Should be called before closing the browser session.
     * {@link https://github.com/reallymello/nightwatch-saucelabs-endsauce/blob/master/README.md | Requires configuration}
     */
    endSauce(): Awaitable<NightwatchAPI, any>;

     /**
     * When called from the afterEach test hook `endSauceAnnotations` will update the temporary test run name
     * and status in the SauceLabs portal with the name of the actual test and the pass or fail
     * status of the it. This uses the JavaScript Executor to update the test during run time rather than
     * doing API calls.
     * Should be called before closing the browser session.
     * {@link https://github.com/reallymello/nightwatch-saucelabs-endsauce/blob/master/README.md | Requires configuration}
     */
     endSauceAnnotation(): Awaitable<NightwatchAPI, any>;
  }
}