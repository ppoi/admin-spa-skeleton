'use strict';

/**
 * セッション情報
 */
class Session {

  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 現在のセッションで有効なパーミッションかどうかをチェックします
   * @param {Permission} permission
   */
  authz(permission) {
    if(typeof permission == 'string') {
      //TODO: ここで現在のセッションの認可を行ってください
      return permission == '/demo';
    } else {
      //TODO: ここで現在のセッションの認可を行ってください
      return false;
    }
  }
}

/**
 * パーミッション
 */
class Permission {
}

export {
  Session,
  Permission
}