<template>
  <section class="align-items-center d-flex flex-column justify-content-center flex-xxl-row">
    <!--        <TheCalendar class="m-5" @click-date="setEventsDateData" />-->
    <TheCalendarGrid class="m-5" @click-date="setEventsDateData" />
    <NextEventsSlider v-if="nextEvents.length" :events="nextEvents" class="m-5" />
  </section>
  <EventList :events="eventList" :event-date="eventDate" class="m-5" />
</template>

<script>
import { ref } from 'vue';
import TheCalendarGrid from '@/components/TheCalendarGrid.vue';
import TheCalendar from '@/components/TheCalendar.vue';
import NextEventsSlider from '@/components/NextEventsSlider.vue';
import EventList from '@/components/EventList.vue';

export default {
  components: { EventList, NextEventsSlider, TheCalendar, TheCalendarGrid },

  setup() {
    const eventList = ref([]);
    const eventDate = ref('');
    const nextEvents = ref([]);

    const setEventsDateData = ({ date, eventsOfTheDate, futureEvents }) => {
      eventList.value = eventsOfTheDate;
      eventDate.value = date;
      // nextEvents.value = [...eventsOfTheDate, ...futureEvents];
      nextEvents.value = futureEvents;
    };

    return {
      eventDate,
      eventList,
      nextEvents,
      setEventsDateData,
    };
  },
};
</script>

<style>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}

.app-w-fit {
  width: fit-content;
}
</style>
