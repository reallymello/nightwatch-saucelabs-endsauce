declare module 'nightwatch' {
  export interface NightwatchCustomCommands {
      endSauce(): Awaitable<NightwatchAPI>;
  }
}