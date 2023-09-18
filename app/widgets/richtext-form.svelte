<script>
  import jQuery from 'jquery';
  import { onDestroy, onMount } from "svelte";

  export let value = "";
  export let placeholder = "本文を入力してください。";

  let container;

  onMount(()=>{
    if(container) {
      jQuery(container).summernote({
        lang: 'ja-JP',
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
        ],
        placeholder: placeholder,
        disableDragAndDrop: true,
        height: 200,
        callbacks: {
          onChange: (contents)=>value=contents
        }
      });
    }
  });
  onDestroy(()=>{
    if(container) {
      jQuery(container).summernote('destroy');
    }
  });
</script>

<div bind:this={container}></div>
