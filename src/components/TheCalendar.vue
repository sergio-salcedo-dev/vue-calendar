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
    <div v-if="!isInCurrentMonth" class="d-flex justify-content-center mt-4">
      <button class="btn btn-success" @click="goToday">Go today</button>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue';
import { format, startOfMonth, addMonths, addDays, eachWeekOfInterval, eachDayOfInterval, startOfWeek } from 'date-fns';
import locale from 'date-fns/locale/es/index';
import arrowRight from 'bootstrap-icons/icons/arrow-right.svg';
import arrowLeft from 'bootstrap-icons/icons/arrow-left.svg';

export default {
  name: 'TheCalendar',

  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:selectedDate'],

  setup(props, { attrs, emit, slots, expose }) {
    const date = ref(new Date());
    const events = [...props.events];
    const formattedMonth = computed(() => format(date.value, 'MMMM yyyy'));
    const selectedDay = ref(null);
    const weeks = computed(() => {
      const firstDayOfMonth = startOfMonth(date.value);
      const lastDayOfMonth = addMonths(firstDayOfMonth, 1);
      const firstDayOfWeek = startOfWeek(firstDayOfMonth);
      const lastDayOfWeek = startOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
      const weekRange = { start: firstDayOfWeek, end: lastDayOfWeek };
      const allWeeks = eachWeekOfInterval(weekRange, { locale, weekStartsOn: 1 });
      const weeksInTheMonth = allWeeks.filter((week) => {
        const weekDays = eachDayOfInterval({ start: week, end: addDays(week, 6) });

        return (
          weekDays.some((day) => day >= firstDayOfMonth && day <= lastDayOfMonth) &&
          !weekDays.every((day) => day >= lastDayOfMonth)
        );
      });

      return weeksInTheMonth.map((week) => eachDayOfInterval({ start: week, end: addDays(week, 6) }));
    });
    const previousMonth = () => (date.value = addMonths(date.value, -1));
    const nextMonth = () => (date.value = addMonths(date.value, 1));
    const hasEvent = (date) => events.some((event) => event.date === format(date, 'yyyy-MM-dd'));
    const isInCurrentMonth = computed(() => formattedMonth.value === format(new Date(), 'MMMM yyyy'));
    const isToday = (date) => {
      if (!date) {
        return false;
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      const day = format(date, 'yyyy-MM-dd');

      return today === day;
    };
    const isInMonth = (day) => {
      const firstDayOfMonth = startOfMonth(date.value);
      const lastDayOfMonth = addMonths(firstDayOfMonth, 1);

      return day >= firstDayOfMonth && day < lastDayOfMonth;
    };
    const isSelected = (day) => selectedDay.value === day;
    const formattedDay = (day) => format(day, 'dd');
    const goToday = () => (date.value = new Date());

    const onDateClick = (date) => {
      selectedDay.value = date;
      emit('update:selectedDate', date);
    };

    return {
      date,
      formattedMonth,
      weeks,
      selectedDay,
      isInCurrentMonth,
      arrowRight,
      arrowLeft,
      previousMonth,
      nextMonth,
      hasEvent,
      isToday,
      isInMonth,
      formattedDay,
      onDateClick,
      isSelected,
      goToday,
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
