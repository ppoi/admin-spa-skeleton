<script context="module">
  import { router, defaults } from 'rawth';
  defaults.base = window.location.origin;

  export function navigate(path) {
    console.log('[pages] navigate', path);
    setTimeout(()=>{
      window.history.pushState(null, null, path);
      router.push(path);
    });
  }
</script>
<script>
  import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
  import { routerMatched } from './store.js';

  router.on.value((val)=>{
    console.log('[pages] route!', val, $routerMatched);
    $routerMatched = false;
  });
  router.on.error((error)=>{
    console.error('[pages] router errored', error);
  });

  async function handleClick(ev) {
    if(ev.defaultPrevented) {
      // 条件: 不活性化されてない
      return;
    }
    let node = ev.target;
    do {
      if(node.nodeName == 'A') {
        // 条件: Aタグ内からのclickイベント
        if(node.dataset['widget'] == 'pushmenu') {
          // 条件: (AdminLTE対応)data-widget="pushmenu"がない
          break;
        };
        let href = node.attributes.href;
        if(href && href.value && href.value.startsWith('#')) {
            // 条件: hrefが定義されている
            //   a. 「#...」じゃない
            //   b. クロスドメインじゃない
            break;
        }
        ev.preventDefault();
        navigate(node.attributes.href.value);
        break;
      }
      node = node.parentNode;
    } while(node);
  }

  onMount(()=>{
    console.log('[pages] pages mounted');
    router.push(window.location.pathname + window.location.search);
  });
  onDestroy(()=>{
    console.log('[pages] pages destroyed');
  });
  beforeUpdate(()=>console.log('[pages] before-update'));
  afterUpdate(()=>console.log('[pages] after-update'));
  $: console.log('[pages] react!');
</script>

<svelte:window on:click="{ handleClick }" on:load="{()=>{ window.onpopstate = ()=>router.push(window.location.pathname + window.location.search) }}" />

<slot></slot>
{#if !$routerMatched}
<slot name="falldown">not found.</slot>
{/if}