<script lang="ts">
  type CounterProps = {
    initialCount?: number;
  };
  let { initialCount = 42 }: CounterProps = $props();
  let count: number = $state(initialCount);
  const increment = () => {
    count += 1;
  };
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

<button onclick={increment} class="fancy">
  count is {count}
</button>

<style>
  .fancy {
    color: orchid;
    background-color: royalblue;
  }
</style>
