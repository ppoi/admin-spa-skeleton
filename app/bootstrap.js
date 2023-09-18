'use strict';

import { Session } from './session';

/**
 * 初期化関数
 * @return {Promise<Session>}
 */
function bootstrap() {
  return new Promise((resolve, reject)=>{
    //初期化処理をここに記載してください。
    resolve(new Session);
});
}

export {
  bootstrap
};