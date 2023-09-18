'use strict';

import * as fsPromise from 'node:fs/promises'
import { last } from 'lodash-es';

const TYPES_IMAGES = ['gif', 'jpg', 'jpeg', 'png'];
const TYPES_TEXT = ['txt'];

export const sendFile = async (filePath, res)=>{
  let handle;
  try {
    handle = await fsPromise.open(filePath, 'r');
    console.log('sending file', filePath);

    let contentType;
    let fileExtension = last(filePath.split('.'));
    if(TYPES_IMAGES.includes(fileExtension)) {
      contentType = 'image/' + responseSettings[2];
    } else if(TYPES_TEXT.includes(fileExtension)) {
      contentType = 'text/plain';
    } else {
      contentType = 'application/' + fileExtension;
    }
    res.setHeader('Content-Type', contentType);

    let contentLength = (await handle.stat()).size;
    res.setHeader('Content-Length', contentLength);

    let eof = false;
    while(!eof) {
      await handle.read().then((chunk)=>{
        console.log('data', chunk.bytesRead);
        if(chunk.bytesRead > 0) {
          res.write(chunk.buffer);
        } else {
          eof = true;
        }
      });
    }
  } catch(e) {
    if(e.code == 'ENOENT') {
      console.log('missing file', filePath);
      res.statusCode = 404;
    } else {
      throw e;
    }
  }
  finally {
    if(handle) {
      await handle.close();
    }
  }
};

