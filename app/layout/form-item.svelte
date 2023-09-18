<script>
  export let title = '';
  export let required = false;

  export const VALID = 0;
  export const EDITING = 1;
  export const INVALID = 2;

  let formState = VALID;
  let formMessage = '';

  export function setState(state) {
    console.log('state', state);
    if(typeof state === 'object') {
      formState = state.state;
      formMessage = state.message;
    } else {
      formState = VALID;
      formMessage = '';
    }
  };

  export function getState() {
    return {
      state: formState,
      message: formMessage
    };
  }

</script>

<div class="form-group">
  <label class="control-label item-label {required ? 'required' : ''}"><slot name="title">{ title }</slot></label>
  <div class="title-options"><slot name="title-options"></slot></div>
  <div class="form-item">
    <slot></slot>
  </div>
  {#if formState == INVALID}
  <span class="help-block">{formMessage}</span>
  {/if}
</div>

<style>
  .title-options {
    display: inline-block;
    margin-left: 8px;
  }
</style>