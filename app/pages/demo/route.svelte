<script>
  import Page from "../../layout/page.svelte";
  import ListPage from "./list-page.svelte";
  import EditPage from "./edit-page.svelte";
  import DetailPage from "./detail-page.svelte";
  import Auth from "../../layout/auth.svelte";
</script>

<Auth permission="/demo"><Page path="/demo" component="{ListPage}"></Page></Auth>
<Auth permission="/demo"><Page path="/demo/new" component="{EditPage}"></Page></Auth>
<Auth permission="/demo"><Page path="/demo/:itemId(\d+)" component="{DetailPage}"></Page></Auth>
<Auth permission="/demo"><Page path="/demo/:itemId(\d+)/edit" component="{EditPage}"></Page></Auth>
<Auth permission="/demo-admin"><Page path="/demo-admin" component="{ListPage}"></Page></Auth>