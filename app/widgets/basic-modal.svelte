<script context="module">
  import jQuery from 'jquery';
</script>
<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let size = "lg";
  export let options = {
    show: false
  };
  let modal = null;
  let bsModal = null;
  let dispatcher = createEventDispatcher();

  /**
   * モーダルを表示します。
   * @param {Function} [callback] - モーダル表示後に実行されるコールバック処理
   */
  export function show(callback) {
    if(typeof callback === 'function') {
      bsModal.one('shown.bs.modal', callback);
    }
    bsModal.modal('show');
  }

  /**
   * モーダルを非表示にします。
   * @param {Function} [callback] - モーダル非表示後に実行されるコールバック処理
   */
   export function hide(callback) {
    if(typeof callback === 'function') {
      bsModal.one('hidden.bs.modal', callback);
    }
    bsModal.modal('hide');
  }

  export function handleUpdate() {
    jQuery(modal).modal('handleUpdate');
  }

  onMount(()=>{
    return ()=>{
      console.log('modal destroyed');
      hide(()=>{
        bsModal.modal('dispose');
        console.log('disposed');
      });
    }
  });
  onDestroy(()=>{
  });

  $: {
    if(modal) {
      bsModal = jQuery(modal)
        .on('show.bs.modal', ()=>dispatcher('show'))
        .on('shown.bs.modal', ()=>dispatcher('shown'))
        .on('hide.bs.modal', ()=>dispatcher('hide'))
        .on('hidden.bs.modal', ()=>dispatcher('hidden'));
      bsModal.modal(options);
    }
  }

</script>

<div class="modal fade" bind:this={modal}>
  <div class="modal-dialog modal-{size}">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"><slot name="title"></slot></h5>
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</div>