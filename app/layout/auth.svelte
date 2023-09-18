<script>
  import { activeSession } from "../app.svelte";
  export let permission;
</script>

{#if $activeSession.authz(permission)}
<slot></slot>
{/if}