<script context="module">
  import { writable } from "svelte/store";
  let sessionState = writable(0);
</script>
<script>
  import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.js';
  import 'admin-lte/dist/js/adminlte.js';
  import { configure, routeMatched, navigate, registerDOMEventListeners, unregisterDOMEventListeners } from "./core/router";
  import env from './core/env';
  import { onDestroy, onMount } from "svelte";
  import LoadingScreen from "./widgets/loading-screen.svelte";
  import HeaderMenu from "./layout/header-menu.svelte";
  import SideMenu from "./layout/side-menu.svelte";
  import PagesRoute from './pages/route.svelte';
  import session from "./core/session";

  configure({
    base: env.BASE_URL
  });

  onMount(()=>{
    session.listener = (state)=>{
      console.log('[app] change sessionstate.', session.isAnonymous());
      $sessionState += 1;
      navigate(location.href, true);
    };
    navigate(window.location.href, true);
    registerDOMEventListeners();
  });
  onDestroy(()=>{
    unregisterDOMEventListeners();
  })
  $: console.log('[app] matched?', $routeMatched);
</script>

<LoadingScreen></LoadingScreen>
{#key $sessionState}
<HeaderMenu></HeaderMenu>
<SideMenu></SideMenu>
<div class="content-wrapper">
  <PagesRoute></PagesRoute>
  {#if !$routeMatched}
    <div>not found.</div>
  {/if}
</div>
{/key}