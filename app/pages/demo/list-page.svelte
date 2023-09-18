<script>
  import Breadcrumb from '../../widgets/breadcrumb.svelte';
  import PageContent from "../../layout/page-content.svelte";
  import Datatables from '../../widgets/datatables.svelte';
  import { navigate } from '../../router/pages.svelte';
  import { beforeUpdate, onMount, onDestroy } from 'svelte';

  const tableOpts = {
    data: async ()=>{
      return await fetch('/api/demo').then(res=>{
        if(res.ok) {
          return res.json();
        } else {
          throw res;
        }
      }).then(data=>{
        return data;
      });
    },
    columns: [
      {title: 'テキスト', data: 'text', class: "link dt-text"},
      {title: '数字', data: 'number', class: "dt-text"},
      {title: '日付[1]', data: 'date1', width: '4.5em'},
      {title: '日付[2]', data: 'date2', width: '4.5em', render: (data)=>(data||'')}
    ],
    language: {
      "sEmptyTable":"テーブルにデータがありません"
    },
  }

  function rowClicked(row) {
    console.log(row.detail);
    navigate(`/demo/${row.detail.id}`);
  }

  onMount(()=>console.log("mounted"));
  beforeUpdate(()=>console.log("before update"));
  onDestroy(()=>console.log("destroyed"));

</script>

<PageContent>
  <Breadcrumb slot="title" items="{['デモ']}"></Breadcrumb>
  <div class="content-navimenu">
    <a href="/demo/new"><i class="text-green fa fa-fw fa-plus-circle"></i>作成</a>
  </div>
  <Datatables {...tableOpts} on:row_clicked="{rowClicked}" tabIndex="1"></Datatables>
</PageContent>