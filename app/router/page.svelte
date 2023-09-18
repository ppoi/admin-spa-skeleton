<script>
  import route, { router, toRegexp, match } from 'rawth';
  import { routerMatched } from './store.js';
  import { afterUpdate, beforeUpdate, onDestroy, onMount, tick } from "svelte";

  export let title = 't:';
  export let path;
  export let component = null;
  let active = false;
  let props = {};

  $: console.log('[page] reactive', path, active);

  function exit() {
    console.log('[page] exit!!!!', path, active);
    if(active) {
      router.off.value(checkExit);
      active = false;
    }
  }

  function checkExit(routed) {
    console.log('[page] exit?', title, routed, path, pathRegexp);
    if(!match(routed, pathRegexp)) {
      exit();
    }
  }

  const pathRegexp = toRegexp(path);

  const stream = route(path);
  stream.on.value(async params=>{
    console.log('[page] routed!', title, params);
    exit();
    await tick();
    props.route = params;
    active = true;
    router.on.value(checkExit);
    $routerMatched = active;
  });
  stream.on.error((error)=>console.log('[page] error', error));

  onDestroy(()=>{
    console.log('[page] destroy', path);
    if(active) {
      router.off.value(checkExit);
    }
    stream.end();
  });

  onMount(()=>console.log('[page] mounted', path));
  beforeUpdate(()=>console.log('[page] before-update', path));
  afterUpdate(()=>console.log('[page] after-update', path));
</script>

{#if active}
<svelte:component this="{component}" {...props}></svelte:component>
{#if !component}
<slot></slot>
{/if}
{/if}