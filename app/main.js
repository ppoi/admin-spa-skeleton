'use strict';

import './vendor.js';
import App from './app.svelte';
import { bootstrap } from './bootstrap.js';

bootstrap().then((session)=>{
  new App({
    target: document.querySelector('#app'),
    props: {
      session: session
    }
  });
});
