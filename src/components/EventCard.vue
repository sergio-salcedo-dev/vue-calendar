<template>
  <article class="card">
    <div class="card-body d-flex flex-column justify-content-between align-items-center">
      <h5 class="card-title text-capitalize text-center h4 mb-3">{{ event.title }}</h5>
      <p class="d-flex flex-column align-items-center">
        <span>{{ event.date }}</span>
        <span>{{ event.time }}h</span>
      </p>
      <p v-if="event.description" class="card-text p-3 mb-0">{{ event.description }}</p>
      <div class="d-flex justify-content-center mt-4">
        <button class="btn btn-success">Register</button>
      </div>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const event = computed(() => ({ ...props.item }));

    return {
      event,
    };
  },
};
</script>

<style scoped>
.card {
  min-height: 320px;
}
</style>
