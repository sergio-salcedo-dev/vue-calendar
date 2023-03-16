<template>
  <section class="d-flex flex-column justify-content-center align-items-center">
    <header class="h2">{{ date }}</header>
    <template v-if="eventsOfTheDate?.length">
      <p class="h3 my-4 text-secondary text-capitalize">{{ eventsOfTheDate?.length }} events</p>
      <ul class="list-unstyled d-flex justify-content-center align-items-center flex-column">
        <li v-for="event in eventsOfTheDate" :key="event.event_id" class="alert alert-primary m-2 app-w-fit">
          <span class="fw-bold">{{ event.title }}</span
          >{{ event.description && `: ${event.description}` }}
        </li>
      </ul>
    </template>
    <p v-else class="h3 mt-3 text-secondary">No events</p>
  </section>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    eventDate: {
      type: String,
      default: '',
    },
    events: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const eventsOfTheDate = computed(() => {
      return props.events;
    });

    const date = computed(() => {
      return props.eventDate;
    });

    return {
      eventsOfTheDate,
      date,
    };
  },
});
</script>
