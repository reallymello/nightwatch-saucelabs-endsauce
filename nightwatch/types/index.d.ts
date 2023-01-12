import { NightwatchAPI, Awaitable } from 'nightwatch';

declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
    endSauce(): Awaitable<NightwatchAPI>;
  }
}