<template>
  <section class="d-flex flex-column justify-content-center flex-xxl-row">
    <!--  <TheCalendar v-model:selectedDate="selectedDate" :events="calendarEvents" class="m-5" />-->
    <TheCalendarGrid v-model:selectedDate="selectedDate" :events="calendarEvents" class="m-5" />
    <NextEventsSlider v-if="nextEvents.length" :events="nextEvents" class="m-5" />
  </section>
  <EventList :events="eventsOfTheDate" :event-date="eventDate" class="mb-5" />
</template>

<script>
import { computed, ref } from 'vue';
import TheCalendarGrid from '@/components/TheCalendarGrid.vue';
import TheCalendar from '@/components/TheCalendar.vue';
import NextEventsSlider from '@/components/NextEventsSlider.vue';
import EventList from '@/components/EventList.vue';
import { generateRandomEvents } from '@/services/eventGeneratorService.js';
import { format, isSameMonth, isSameYear, startOfMonth } from 'date-fns';

export default {
  components: { EventList, NextEventsSlider, TheCalendar, TheCalendarGrid },

  setup() {
    const calendarEvents = generateRandomEvents();
    const selectedDate = ref(new Date());
    const setSelectedDate = (date) => (selectedDate.value = date);
    const eventDate = computed(() => format(selectedDate.value, 'EEEE MMMM d, yyyy')); // Wednesday March 15, 2023
    const eventsOfTheDate = computed(() =>
      calendarEvents.filter((event) => event.date === format(selectedDate.value, 'yyyy-MM-dd'))
    );
    const nextEvents = computed(() => {
      const nextEvents = calendarEvents.filter((event) => new Date(event.date) >= new Date(selectedDate.value));

      return sortEvents(nextEvents);
    });
    const sortEvents = (events) => {
      return events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateA.getTime() - dateB.getTime();
      });
    };
    const eventsInTheMonth = (date) => {
      const eventsInTheMonth = calendarEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const givenDate = new Date(date);

        return (
          isSameMonth(eventDate, givenDate) && isSameYear(eventDate, givenDate) && eventDate >= startOfMonth(givenDate)
        );
      });

      return sortEvents(eventsInTheMonth);
    };

    return {
      calendarEvents,
      selectedDate,
      eventDate,
      eventsOfTheDate,
      nextEvents,
      setSelectedDate,
      eventsInTheMonth,
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
