<script>
  import session from "../core/session";
  export let permission;
  $: console.log('[auth] permission', permission);
</script>

{#if !session.isAnonymous()}
<slot></slot>
{/if}