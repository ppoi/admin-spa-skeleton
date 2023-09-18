'use strict';

import { SimpleFile } from "./simplefile";
let config;
try {
  config = (await import('./mock-config')).default;
} catch(e) {
  config = {};
}

const plugin = ()=>({
  name: 'mockmoon-vite-plugin',
  configureServer(server) {
    console.log('configure!', config);
    let simpleFileMock = new SimpleFile();
    simpleFileMock.configure(config.simpleFile);
    server.middlewares.use('/api', simpleFileMock.router());
  }
});

export default plugin;