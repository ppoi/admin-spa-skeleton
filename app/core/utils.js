'use strict';

import { startsWith } from "lodash-es";
import { AppError } from "./errors";

/**
 * @callback responseHandler
 * @param {Response} response
 * @param {*} data
 * @returns {any} resolve value
 * @throws {any} reject value
 */

/**
 * JSONレスポンスを返すPromise<Response>のハンドラーラッパー
 * 1. Content-Typeがappliction/jsonではない場合 → reject()
 * 2. HTTP status(あるいは'ok', 'ng')に対応するハンドラがある場合
 *     - jsonパースでエラーが発生した場合、エラー情報でreject
 *     - responseHandlerが正常終了した場合はその戻り値でresolve
 *     - 例外をthrowした場合はその例外オブジェクトでreject
 * 3. ハンドラがなくres.okがtrueの場合 → resolve(data)
 * 4. ハンドラがなくres.okがfalseの場合 → reject()
 * @param {Promise<Response>} promise fetch promise
 * @param {(Function|Object<(number|'ok'|'ng'),responseHandler>)} [handlers]
 * @returns {Promise}
 */
export function jsonApi(promise, handlers) {
  return new Promise((resolve, reject)=>{
    promise.then(async res=>{
      if(startsWith('application/json'), res.headers.get('content-type')) {
        try {
          let data = await res.json();
          let handler;
          if(typeof handlers === 'function' && res.ok) {
            handler = handlers;
          } else if(handlers != null) {
            handler = handlers[res.status] || handlers[res.ok ? 'ok' : 'ng'];
          }
          if(handler != null) {
            try {
              resolve(handler(res, data));
            } catch(e) {
              reject(e);
            }
          } else if(res.ok) {
            console.log('[api] default handler. return data.', res.status);
            resolve(data);
          } else {
            console.log('[api] handler missing', res.status);
            reject();
          }
        } catch(e) {
          reject(new AppError('api', 'invalid format response body', e));
        }
      } else {
        reject({
          type: 'api',
          reason: {
            message: `unexpected content-type: ${res.headers.get('content-type')}`
          }
        });
      }
    }).catch(e=>{
      reject({
        type: 'api',
        reason: {
          message: 'unexpected error occured',
          cause: e
        }
      });
    });
  });
}