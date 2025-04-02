'use strict';

import { bootstrap, session } from '@admin-spa-skeleton/core';
import { cognito } from '@admin-spa-skeleton/core/session/modules';
import { mount } from 'svelte';
import app from './app.svelte';

try {
  await bootstrap({
    envDef: import.meta.env.VITE_ENV_URL,
    sessionDef: {
      module: cognito,
      tokenStore: 'local'
    }
  });
  mount(app, {
    target: document.querySelector('#app')
  });
  if(!session.isAnonymous()) {
    console.log('[main] authenticated.');
  }
} catch(e) {
  console.error('[main] fail to initialize app.', e);
  alert('fail to initialize app.');
}
