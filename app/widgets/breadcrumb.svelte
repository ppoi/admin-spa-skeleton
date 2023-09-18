<script>
  export let items = [];
</script>

<ol class="breadcrumb">
  {#each items as item }
  <li class="breadcrumb-item">
    {#if typeof item === 'object'}
      <a href="{item.path}">{item.title}</a>
    {:else}
      {item || ''}
    {/if}
  </li>
  {/each}
</ol>

<style>
  ol {
      display: inline-block;
      padding: 0px 10px;
      margin: 0px;
      list-style: none;
      background-color: white;
  }
  li {
    display: inline-block;
  }
  li+li::before {
      content: ">";
  }
</style>