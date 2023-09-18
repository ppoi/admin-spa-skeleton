'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { isNumber } from 'lodash-es';
import { sendFile } from './fsutils';

class SimpleFile {
  constructor() {
    this.config = {
      basedirs: [path.resolve(__dirname, './files')],
      latency: 0
    };
  }

  configure(config) {
    console.log('incoming config', config);
    return new Promise((resolve, reject)=>{
      //latency
      if(isNumber(config.latency)) {
        this.config.latency = config.latency;
      } else {
        reject(`invalid latency: ${config.latency}`);
        return;
      }

      // mockdirs
      if(config.basedirs && config.basedirs.length) {
        Promise.allSettled(
          config.basedirs.map(path=>new Promise((res, rej)=>fs.stat(path, (err, stats)=>{
            if(err) {
              rej(err.message);
            } else if(!stats.isDirectory) {
              rej(`${path} is not a directory.`);
            } else {
              res(true);
            }
          })))
        ).then(results=>{
          console.log(results);
          let messages = results.filter(r=>r.status=='rejected').map(r=>r.reason);
          console.log('message: ', messages, messages.length);
          if(messages.length) {
            reject({
              message: messages
            });
          } else {
            this.config.basedirs = config.basedirs;
            resolve({
              handlerConfig: this.config
            })
           }
        });
      } else {
        setTimeout(()=>resolve({handlerConfig: this.config}))
      }
    });
  }

  dispose() {
  }

  router() {
    return (req, res, next)=>{
      console.log("[mock] process mock request [" + req.url + "] with", this.config.latency, '[msec] latency.');
      res.setHeader('Cache-Control', ['no-cache', 'no-store', 'max-age=0', 'must-revailidate']);
      res.setHeader('Expires', '0');
      res.setHeader('Pragma', 'no-cache');
      setTimeout(async ()=>{
        try {
          let responseFilePrefix = req.method + '_' + req.url.split('/').filter(s => s).join('-') + '_';
          for(let basedir of this.config.basedirs) {
            let entries = fs.readdirSync(basedir, { withFileTypes: true });
            for(let entry of entries) {
              if(entry.isFile() && entry.name.startsWith(responseFilePrefix)) {
                let responseSettings = /_(\d{3})\..+$/.exec(entry.name);
                if(responseSettings) {
                  res.statusCode = parseInt(responseSettings[1]);
                  await sendFile(path.resolve(basedir, entry.name), res);
                  return;
                }
              }
            }
          }
          console.log(`[mock] mock file missing. send 404`, this.config.basedirs);
          res.statusCode = 404;
        } catch(e) {
          console.error('[mock] ERROR!', e);
          res.statusCode = 500;
        } finally {
          console.log('[mock] proccess finised.');
          res.end();
        }
      }, this.config.latency);
    };
  };
}

export {
  SimpleFile
};