'use strict';

import bootstrap from "./core/bootstrap";
import * as oidc from "./core/session/oidc";
import * as app from './app.svelte';

try {
  /** @typeof {import(./core/bootstrap).CoreConf} */
  await bootstrap({
    envDef: import.meta.env.VITE_ENV_URL,
    session: {
      module: oidc,
      tokenStore: 'local'
    },
    application: {
      target: '#app',
      rootTag: app
    }
  });
} catch(e) {
  console.error('[main] fail to initialize app.', e);
  alert('fail to initialize app.');
}
