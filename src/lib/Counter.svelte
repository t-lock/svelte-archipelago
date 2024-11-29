<script lang="ts">
  import { count as globalCount } from "./globalCount.svelte";

  type CounterProps = {
    initialCount?: number;
  };
  let { initialCount = 42 }: CounterProps = $props();
  let count: number = $state(initialCount);

  function incrementLocal() {
    count += 1;
  }

  function incrementGlobal() {
    globalCount.value += 1;
  }
</script>

<svelte:window
  on:resize={(e) => {
    console.log(e);
  }}
/>

<svelte:head>
  <meta name="github:site" content="@t-lock" />
  <meta name="github:creator" content="@t-lock" />
</svelte:head>

<button onclick={incrementLocal} class="fancy">
  local count is {count}
</button>
<button onclick={incrementGlobal}>
  global count is {globalCount.value}
</button>

<style>
  .fancy {
    color: pink;
    background-color: rebeccapurple;
  }
</style>
