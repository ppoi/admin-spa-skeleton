'use strict';

import { SAML } from "@node-saml/node-saml";
import { ServerResponse, IncomingMessage } from 'node:http';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const options = {
  callbackUrl: 'http://localhost:8080/assert',
  entryPoint: 'https://idcs-4e6cc6b89f124223a5655ddbfb2ddd72.identity.oraclecloud.com/fed/v1/idp/sso',
  issuer: 'ella-saml',
  cert: 'MIIDZjCCAk6gAwIBAgIGAYtGX0OqMA0GCSqGSIb3DQEBCwUAMFkxEzARBgoJkiaJk/IsZAEZFgNjb20xFjAUBgoJkiaJk/IsZAEZFgZvcmFjbGUxFTATBgoJkiaJk/IsZAEZFgVjbG91ZDETMBEGA1UEAxMKQ2xvdWQ5Q0EtMjAeFw0yMzEwMTkwNTE4NTBaFw0zMzEwMTkwNTE4NTBaMFsxEzARBgNVBAMTCnNzbERvbWFpbnMxDzANBgNVBAMTBkNsb3VkOTEzMDEGA1UEAwwqaWRjcy00ZTZjYzZiODlmMTI0MjIzYTU2NTVkZGJmYjJkZGQ3Ml9rZXlzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqKZY+o3QJpfxH2Z7ycSj442ZD3ysJuZxPdmlPhE6SCjeP2xgOuBmRcdkSd8o2BRE5HR4XJvYh2jSjFnocC5xzYVPopUX2hR2fB6vC0M6ZlhEOQfqkBBw2ZyMu7X4B1VIUW53KPY0ILyaIk0gDWru4qJYrd9VA8ceQ1azH5eRAtJqOaZtklNtR3UooAHFWbT5numQQFAoQdPkYMW+wJEmXUaonOWw/+nMKa7zH8A5JfsBxVarV+rfw5slkkoxpInqVrGlz8dLcH0hPUct3qt8TiwYlYrgpCa6QjGcut97YY4LH1+zGv4KdNDr7eSrdFYu/wGyy4Y2o8hms4D3JsQoUwIDAQABozIwMDAPBgNVHQ8BAf8EBQMDB/gAMB0GA1UdDgQWBBSuclvMpEV4/vM3Q7aX3WSeMUqzAjANBgkqhkiG9w0BAQsFAAOCAQEAnAkQ8vEVmk5gx+j+uqJGKNGsfOocV1GDuzx1T7Nltctk/dAoxeRflNhpC4yV0UAiHo5HwH3pdtkuOPMpdMj6IAcn53VeFBsRKDb9DU/VNTY82eCaslrEyBRfFYprcFCnJBCzVqyGH/cJuMbVMzENiMOqCsyb+9JFpabwTVVjm3c62bLUMWXM8NCqMIEBnmU+xuGzk2uh993sGbARmbEnwhEJoLQbT60gJ6p7mpRoKhNtyY9FEnA4h34MAL89oTqJR2wK4rI1bP6+XyJ8CpqQ6AUGZOvUoDHArIe4PIakNWdoIYq4/g6iF3Uvav+JL7IpaQFDduqP54bAD8k9ah1sZA==',
  digestAlgorithm: 'sha256',
  signatureAlgorithm: 'sha256',
  validateInResponseTo: 'never'
};

const saml = new SAML(options);

/**
 * SAMLレスポンスからアサーションを検証し、ユーザ認証を完了します
 * @param {IncomingMessage} req HTTPリクエスト
 * @param {ServerResponse} res HTTPレスポンス
 * @param {} next 
 */
function consumeAssert(req, res, next) {
  if(req.method != 'POST') {
    console.log('[saml] not POST request.');
    next();
    return;
  }

  console.log('[saml] samlResponse', Buffer.from(req.body.SAMLResponse, 'base64'));
  saml.validatePostResponseAsync(req.body).then((profile, loggedOut)=>{
    console.log('[saml] assert', profile, loggedOut);
    res.statusCode = 301;
    res.setHeader('Set-Cookie', `__AUTH_PROFILE__=${profile.nameID}`);
    res.setHeader('Location', '/');
    res.end();
  }).catch(e=>{
    console.log('[saml] error!', e);
    res.statusCode = 401;
    res.end(Buffer.from(req.body.SAMLResponse, 'base64'));
  });
}

/**
 * @param {IncomingMessage} req HTTPリクエスト
 * @param {ServerResponse} res HTTPレスポンス
 * @param {} next 
 * @returns 
 */
function signIn(req, res, next) {
  saml.getAuthorizeUrlAsync().then((url)=>{
    res.statusCode = 301;
    res.setHeader('Location', url);
    res.end();
  });
}

/**
 * @param {IncomingMessage} req HTTPリクエスト
 * @param {ServerResponse} res HTTPレスポンス
 * @param {} next 
 * @returns 
 */
function signOut(req, res, next) {
  let nameID = req.cookies['__AUTH_PROFILE__'];
  if(nameID != null) {
    saml.getLogoutUrlAsync({nameID: nameID, nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'}).then(url=>{
      res.statusCode = 301;
      res.setHeader('Location', url);
      res.end();
    });
  }
}

const plugin = ()=>({
  name: 'saml-consumer',
  configureServer(server) {
    server.middlewares.use(bodyParser.urlencoded(false));
    server.middlewares.use(cookieParser());
    server.middlewares.use('/assert', consumeAssert);
    server.middlewares.use('/signin', signIn);
    server.middlewares.use('/signout', signOut);
  }
});
export default plugin;