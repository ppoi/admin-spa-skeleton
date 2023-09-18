'use strict';

import { isArguments } from 'lodash-es';
import FormItem from '../layout/form-item.svelte';

/**
 * @param {(HTMLInputElement|HTMLSelectElement|HTMLButtonElement)} elm - バリデーション対象HTML要素
 * @param {Function[]} [validators] - 追加バリデーション関数
 * @returns {string} - バリデーションメッセージ
 */
function validateItem(elm, ...validators) {
  if(elm == null) {
    return null;
  }
  console.log(validators);

  // メッセージクリア
  elm.setCustomValidity('');

  if(!elm.checkValidity()) {
    //HTML validation
    // エラーメッセージのカスタマイズ
    let state = elm.validity;
    if(state.valueMissing) {
      elm.setCustomValidity("必須入力項目です。");
    }
  } else {
    // 追加バリデーション
    if(validators != null) {
      validators.some(v=>v(elm));
      console.log(elm);
    }
  }
  return elm.validationMessage;
};

/**
 * 
 * @param {FormItem} formItem 
 */
function beginEditing(formItem) {
  return ()=>formItem.setState({state:formItem.EDITING});
}

/**
 * FormItemバリデーターを作成します
 * @param {FormItem} formItem - FormItemタグインスタンス
 * @param {(HTMLInputElement|HTMLSelectElement|HTMLButtonElement)} input - FormItem内のHTMLエレメント
 * @param {Function[]} [validators]
 * @returns - バリデーションOKの場合true、それ以外の場合false
 */
function createValidator(formItem, input, ...validators) {
  console.log(validators);
  return ()=>{
    let message = validateItem(input, ...validators);
    if(message && message.length > 0) {
      formItem.setState({state: formItem.INVALID, message});
      return false;
    } else {
      formItem.setState({state:formItem.VALID});
      return true;
    }
  };
}

export {
  validateItem,
  beginEditing,
  createValidator
};