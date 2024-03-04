'use strict';

import { argv, exit } from 'node:process';
import { merge } from "lodash-es";

const AUTH_ENDPOINT = 'https://idcs-4e6cc6b89f124223a5655ddbfb2ddd72.identity.oraclecloud.com:443';
const CLIENT_ID = '5efa8abf03934aac9f1caf4ec7622d02';
const CLIENT_SECRET = '684d64ef-b243-4d6f-ae8e-d0ea29bdb40e';


/**
 * @returns {Promise<String>}
 */
function getToken() {
  return new Promise((resolve, reject)=>{
    // console.log('fetch token', `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`);
    fetch(`${AUTH_ENDPOINT}/oauth2/v1/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&scope=urn:opc:idm:__myscopes__'
    }).then(res=>{
      if(res.ok) {
        return res.json();
      } else {
        reject({
          type: 'api',
          reason: res.status
        });
      }
    }).then(data=>{
      resolve(data.access_token);
    }).catch(e=>{
      reject({
        type: 'network',
        reason: e
      });
    });
  });
}

/**
 * 
 * @param {string} path 
 * @param {Object<string, string>} [options] 
 * @returns 
 */
function callApi(token, path, options) {
  console.log('call api', path);
  return new Promise((resolve, reject)=>{
    fetch(`${AUTH_ENDPOINT}${path}`, merge({
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  
      }
    }, options)).then(res=>{
      console.log(res.status, res.headers.get('Content-Type'));
      if(res.ok && res.headers.get('Content-Type').startsWith('application/json')) {
        return res.json();
      } else {
        return res.text();
      }
    }).then(data=>{
      if(typeof data == 'string') {
        reject({
          type: 'api',
          reason: data
        });
      } else {
        resolve(data);
      }
    }).catch(e=>{
      reject({
        type: 'network',
        reason: e
      });
    });
  });
}

function listUsers(token) {
  return callApi(token, '/admin/v1/Users');
}

function createUser(token, user) {
  return callApi(token, '/admin/v1/Users', {
    method: 'POST',
    body: JSON.stringify(merge({
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      PreferredLanguage: "ja",
      "urn:ietf:params:scim:schemas:oracle:idcs:extension:user:User": {
        byPassNotification: true
      }
    }, user))
  });
}

function listTokens(token, userId) {
  let params = new URLSearchParams();
  params.append('filter', `user.ocid eq "${userId}"`);
  //return callApi(token, `/admin/v1/AuthTokens?${params.toString()}`);
  return callApi(token, `/20160918/users/${userId}/authTokens/`);
}

function usage() {
  console.log('USAGE: oci-tools.js <command> <optios>...');
  console.log('commands:');
  console.log('  listUsers');
  console.log('  createUser <userName> <emailAddress> <givenName> <familyName> <password>');
  exit(1);
}

async function main() {
  if(argv.length < 3) {
    usage();
  }
  let token = await getToken();
  try {
    switch(argv[2]) {
      case 'createUser':
        if(argv.length < 7) {
          usage();
        }
        let userName = argv[3];
        let emailAddress = argv[4];
        let givienName = argv[5];
        let familyName = argv[6];
        let passWord = argv[7];
        let user = await createUser(token, {
          userName: userName,
          displayName: userName,
          emails: [
            {value: emailAddress, type: 'work', primary: true}
          ],
          name: {
            givienName: givienName,
            familyName: familyName
          },
          passWord: passWord
        });
        console.log('created user', user);
        break;
      case 'listUsers':
        let users = await listUsers(token);
        console.log('users', users);
        break;
      case 'listTokens':
        if(argv.length < 4) {
          usage();
        }
        let tokens = await listTokens(token, argv[3]);
        console.log(tokens);
        break;
      default:
        console.log('unknown command:', argv[2]);
        usage();
    }
  } catch(e) {
    console.error(e);
  }
}

main();