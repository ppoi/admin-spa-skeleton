<script>
  import { onMount } from 'svelte';
  import { navigate } from '~/app/core/router';
  import PageContent from '../../layout/page-content.svelte';
  import Breadcrumb from '../../widgets/breadcrumb.svelte';
  import Form from '../../layout/form.svelte';
  import FormItem from '../../layout/form-item.svelte';
  import { beginEditing, createValidator } from '../../utils/validation';
  import { loading } from '../../widgets/loading-screen.svelte';
  import BasicModal from "../../widgets/basic-modal.svelte";
  import session from '~/app/core/session';

  export let params;
  $: console.log(params);

  /**
   * データID
   * @type {number}
   */
  let itemId;
  /**
   * データ
   */
  let item = {};
  /**
   * ページタイトル
   * @type {Array|string} ページタイトル
   */
  let pageTitle = [{title:'デモ',path:"/demo"}];

  // 入力項目群
  let textFormItem, textInput, textValidator;
  let numberFormItem, numberInput, numberValidator;
  let date1FormItem, date1Input, date1Validator;
  let date2FormItem, date2Input, date2Validator;

  let modal1;

  onMount(()=>{
    itemId = params.params.itemId;
    if(itemId != null) {
      $loading = true;
      session.callApi(`/demo/${itemId}`).then(res=>{
        if(res.ok) {
          return res.json();
        } else {
          throw res;
        }
      }).then(data=>{
        item = data;
        pageTitle.push(item.text);
        pageTitle = pageTitle;
      }).catch(e=>{
        //エラー処理
        pageTitle.push('[ERROR]');
        pageTitle = pageTitle;
        console.log(e);
      }).finally(()=>{
        $loading = false;
      })
    } else {
      pageTitle.push('作成');
      pageTitle = pageTitle;
    }
    // 入力項目用バリデータの設定
    textValidator = createValidator(textFormItem, textInput);
    numberValidator = createValidator(numberFormItem, numberInput);
    date1Validator = createValidator(date1FormItem, date1Input);
    date2Validator = createValidator(date2FormItem, date2Input, checkDate2AfterDate1);
    console.log('mounted?', pageTitle);
  });

  /**
    //date1が設定されかつエラーになってない場合、date2の値がdate1より後の日付かどうかをチェック
   * @param {HTMLInputElement} elm
   */
  function checkDate2AfterDate1(elm) {
    console.log(date1Input.value, date2Input.value);
    if(date1Input.value != '' && date1Input.validationMessage == '' && date2Input.value != '') {
      console.log('hgihogege');
      if(date1Input.value >= date2Input.value) {
        elm.setCustomValidity('日付[2]には日付[1]より後の日付を指定してください。');
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function validateAll() {
    let ok = true;
    ok = textValidator() && ok;
    ok = numberValidator() && ok;
    ok = date1Validator() && ok;
    ok = date2Validator() && ok;
    console.log('ok?', ok);
    if(ok) {
      modal1.show();
    }
  }

  function sendData() {
    modal1.hide(()=>{
      //データ更新処理など
      $loading = true;
      setTimeout(()=>{
        if(itemId == null) {
          itemId = 1;
        }
        $loading = false;
        navigate(`/demo/${itemId}`);
      }, 1000);
    });
  }
</script>

<PageContent>
  <Breadcrumb slot="title" items="{pageTitle}"></Breadcrumb>
  <Form>
    <FormItem bind:this="{textFormItem}" required="{true}">
      <svelte:fragment slot="title">文字列</svelte:fragment>
      <input type="text" required bind:this="{textInput}" value="{item.text || ''}" class="form-control" on:blur="{textValidator}" on:focus={beginEditing(textFormItem)}>
    </FormItem>
    <FormItem bind:this="{numberFormItem}">
      <svelte:fragment slot="title">数字</svelte:fragment>
      <input type="number" bind:this="{numberInput}" value="{item.number || ''}" class="form-control" max="100" on:blur="{numberValidator}" on:focus={beginEditing(numberFormItem)}>
    </FormItem>
    <FormItem bind:this="{date1FormItem}" required="{true}">
      <svelte:fragment slot="title">日付[1]</svelte:fragment>
      <input type="date" bind:this="{date1Input}" required value="{item.date1 || ''}" class="form-control" min="2022-12-31" max="2023-10-01" on:blur="{date1Validator}" on:focus={beginEditing(date1FormItem)}>
    </FormItem>
    <FormItem bind:this="{date2FormItem}">
      <svelte:fragment slot="title">日付[2]</svelte:fragment>
      <input type="date" bind:this="{date2Input}" value="{item.date2 || ''}" class="form-control" min="2022-12-31" max="2023-10-01" on:blur="{date2Validator}" on:focus={beginEditing(date2FormItem)}>
    </FormItem>
    <button class="btn btn-primary" on:click|preventDefault={validateAll}>更新チェック</button>
  </Form>
</PageContent>
<BasicModal bind:this="{modal1}">
  <svelte:fragment slot="title">確認</svelte:fragment>
  <p>更新しますか？</p>
  <svelte:fragment slot="footer">
    <button class="btn btn-primary" on:click|preventDefault={sendData}>確認</button>
    <button class="btn btn-link" on:click|preventDefault data-dismiss="modal">キャンセル</button>
  </svelte:fragment>
</BasicModal>
