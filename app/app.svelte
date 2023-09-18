<script context="module">
  import { writable } from 'svelte/store';
  export let activeSession = writable(null);
</script>
<script>
  import Pages from './router/pages.svelte';
  import HeaderMenu from './layout/header-menu.svelte';
  import SideMenu from './layout/side-menu.svelte';
  import AppRoute from './pages/route.svelte';
  import LoadingScreen from './widgets/loading-screen.svelte';
  import { Session } from './session';

  /**
   * @type {Session}
   */
  export let session = null;
  $: $activeSession = session;
</script>

<LoadingScreen></LoadingScreen>
<HeaderMenu/>
<SideMenu/>
<div class="content-wrapper">
  <Pages>
    <AppRoute></AppRoute>
    <div slot="falldown">
      <div class="callout callout-danger" style="margin: 14px">この機能を利用する権限がありません。</div>
    </div>
  </Pages>
</div>