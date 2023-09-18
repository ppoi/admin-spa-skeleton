<script>
  import { onMount } from "svelte";
  import PageContent from "../../layout/page-content.svelte";
  import Breadcrumb from "../../widgets/breadcrumb.svelte";
  import FormItem from "../../layout/form-item.svelte";
  import { loading } from "../../widgets/loading-screen.svelte";

  export let route;
  $: console.log('route', route)

  let itemId = route.params.itemId;
  let pageTitle = '';
  let data = {};

  onMount(()=>{
    // 非同期初期化処理がある場合、最初にローディング画面を表示
    $loading = true;
    fetch(`/api/demo/${itemId}`).then(res=>{
      if(res.ok) {
        return res.json();
      } else {
        throw res;
      }
    }).then(d=>{
      data = d;
      pageTitle = data.text;
      editable = true;
    }).catch(e=>{
      //エラー処理
      pageTitle = '[ERROR]';
    }).finally(()=>{
      // 非同期初期化処理が完了したらローディング画面を非表示
      $loading = false;
    });
  });
</script>

<PageContent>
  <Breadcrumb slot="title" items={[{title:'デモ', path:'/demo'}, pageTitle]}></Breadcrumb>
  <div class="content-navimenu">
    <a href="/demo/{itemId}/edit">
      <i class="fa fa-fw fa-edit"></i>更新/削除
    </a>
  </div>
  <FormItem>
    <svelte:fragment slot="title">テキスト</svelte:fragment>
    {data.text || ''}
  </FormItem>
  <FormItem>
    <svelte:fragment slot="title">数字</svelte:fragment>
    {data.number || ''}
  </FormItem>
  <FormItem>
    <svelte:fragment slot="title">日付[1]</svelte:fragment>
    {data.date1 || ''}
  </FormItem>
  <FormItem>
    <svelte:fragment slot="title">日付[2]</svelte:fragment>
    {data.date2 || ''}
  </FormItem>
</PageContent>
