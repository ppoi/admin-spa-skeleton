'use strict';

import env, { __setup__ as envSetup } from './env.js';
import { AppError } from './errors.js';
import { configure } from './router.js';
import session, { __setup__ as sessionSetup } from './session';


/**
 * @param {import("./index.d.ts").CoreConfig} definition 
 */
export async function bootstrap(definition) {
  try {
    console.log('[bootstrap] initialize');
    console.log('[bootstrap] setup env.', definition);
    await envSetup(definition.envDef);
    console.log('[bootstrap] environment vars fixed.', env);
    console.log('[bootstrap] setup session feature.')
    let s = await sessionSetup(definition.sessionDef)
    await s.checkAuthenticationProceeding();
    console.log('[boottrap] session', s);

    console.log('[bootstrap] configure router. base:', env.BASE_URL);
    configure({
      base: env.BASE_URL
    });
  } catch(e) {
    if(e instanceof AppError) {
      throw e;
    } else {
      throw new AppError('bootstrap', 'fail to setup core features.', e);
    }
  }
};

export {
  env,
  session
};