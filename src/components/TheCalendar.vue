<template>
  <section class="calendar">
    <header class="h1">
      <h2 class="text-center">Calendar</h2>
    </header>
    <article>
      <div class="app-header">
        <button class="btn" @click="previousMonth">
          <img :src="arrowLeft" alt="arrow-left" />
        </button>
        <h3>{{ formattedMonth }}</h3>
        <button class="btn" @click="nextMonth">
          <img :src="arrowRight" alt="arrow-right" />
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in weeks" :key="index">
            <td
              v-for="day in week"
              :key="day"
              :class="{
                'other-month': !isInMonth(day),
                'month-event': hasEvent(day),
                'selected-day': isSelected(day),
              }"
              @click="onDateClick(day)"
            >
              <span class="d-block" :class="{ today: isToday(day) }">{{ formattedDay(day) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
    <div v-if="!isInMonth(selectedDay)" class="d-flex justify-content-center mt-4">
      <button class="btn btn-success" @click="goToday">Go today</button>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue';
import {
  format,
  startOfMonth,
  addMonths,
  addDays,
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfWeek,
} from 'date-fns';
import locale from 'date-fns/locale/es/index';
import { generateRandomEvents } from '@/events-data.js';
import arrowRight from 'bootstrap-icons/icons/arrow-right.svg';
import arrowLeft from 'bootstrap-icons/icons/arrow-left.svg';

export default {
  emits: ['click-date'],

  setup(props, { attrs, emit, slots, expose }) {
    const date = ref(new Date());
    const events = generateRandomEvents();
    const formattedMonth = computed(() => format(date.value, 'MMMM yyyy'));
    const selectedDay = ref(null);

    const weeks = computed(() => {
      const firstDayOfMonth = startOfMonth(date.value);
      const firstDayOfWeek = startOfWeek(firstDayOfMonth);
      const lastDayOfMonth = addMonths(firstDayOfMonth, 1);
      const lastDayOfWeek = startOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
      const weekRange = { start: firstDayOfWeek, end: lastDayOfWeek };
      const allWeeks = eachWeekOfInterval(weekRange, { locale, weekStartsOn: 1 });
      const filteredWeeks = allWeeks.filter((week) => {
        const weekDays = eachDayOfInterval({ start: week, end: addDays(week, 6) });

        return weekDays.some((day) => day >= firstDayOfMonth && day <= lastDayOfMonth);
      });

      return filteredWeeks.map((week) => eachDayOfInterval({ start: week, end: addDays(week, 6) }));
    });

    const previousMonth = () => {
      date.value = addMonths(date.value, -1);
    };

    const nextMonth = () => {
      date.value = addMonths(date.value, 1);
    };

    const hasEvent = (day) => {
      const dateStr = format(day, 'yyyy-MM-dd');

      return events.some((event) => event.date === dateStr);
    };

    const eventsOfTheDate = (day) => {
      const date = format(day, 'yyyy-MM-dd');

      return events.filter((event) => event.date === date);
    };

    const isToday = (day) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const dateStr = format(day, 'yyyy-MM-dd');

      return today === dateStr;
    };

    const isInMonth = (day) => {
      const firstDayOfMonth = startOfMonth(date.value);
      const lastDayOfMonth = addMonths(firstDayOfMonth, 1);

      return day >= firstDayOfMonth && day < lastDayOfMonth;
    };

    const isSelected = (day) => selectedDay.value === day;
    const formattedDay = (day) => format(day, 'dd');
    const goToday = () => (date.value = new Date());

    const onDateClick = (day) => {
      const date = format(day, 'EEEE MMMM d, yyyy'); // Wednesday March 15, 2023
      const selectedDateEvents = eventsOfTheDate(day);
      const futureEvents = events.filter((event) => new Date(event.date) >= new Date(day));
      selectedDay.value = day;

      emit('click-date', { date, eventsOfTheDate: selectedDateEvents, futureEvents });
    };

    onDateClick(date.value);

    return {
      date,
      formattedMonth,
      events,
      weeks,
      arrowRight,
      arrowLeft,
      previousMonth,
      nextMonth,
      hasEvent,
      eventsOfTheDate,
      isToday,
      isInMonth,
      formattedDay,
      onDateClick,
      isSelected,
      goToday,
      selectedDay,
    };
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  /*border: 1px solid #ccc;*/
}

th,
td {
  /*border: 1px solid #ccc;*/
  padding: 1rem;
  text-align: center;
}

.today {
  background-color: teal;
  color: white;
  border-radius: 50%;
  padding: 4px;
}

.month-event {
  background-color: #d4edeb;
}

.other-month {
  color: #ccc;
}

.selected-day {
  /*background-color: aquamarine;*/
  border: 2px solid blue;
}
</style>
