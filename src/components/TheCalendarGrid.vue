<template>
  <section class="calendar-container">
    <header class="h1">
      <h2 class="text-center">Calendar</h2>
    </header>
    <article class="calendar">
      <div class="calendar-header">
        <button class="btn" @click="previousMonth">
          <img :src="arrowLeft" alt="arrow-left" />
        </button>
        <h3>{{ formattedMonth }}</h3>
        <button class="btn" @click="nextMonth">
          <img :src="arrowRight" alt="arrow-right" />
        </button>
      </div>
      <div class="calendar-weekdays">
        <div class="weekday">Mon</div>
        <div class="weekday">Tue</div>
        <div class="weekday">Wed</div>
        <div class="weekday">Thu</div>
        <div class="weekday">Fri</div>
        <div class="weekday">Sat</div>
        <div class="weekday">Sun</div>
      </div>
      <div class="calendar-days">
        <template v-for="week in weeks">
          <div
            v-for="day in week"
            :key="day"
            class="calendar-day"
            :class="{
              'other-month': !isInMonth(day),
              'month-event': hasEvent(day),
              'selected-day': isSelected(day),
            }"
            @click="onDateClick(day)"
          >
            <span class="d-block" :class="{ today: isToday(day) }">{{ formattedDay(day) }}</span>
          </div>
        </template>
      </div>
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
  name: 'TheCalendarGrid',

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
.calendar-container {
  min-height: 560px;
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

.calendar {
  display: grid;
  grid-template-areas:
    'header'
    'weekdays'
    'days';
  grid-template-rows: auto auto 1fr;
  /*grid-gap: 10px;*/
  max-width: 100%;
}

.calendar-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.calendar-weekdays {
  grid-area: weekdays;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekday {
  font-weight: bold;
  text-align: center;
  /*border: 1px solid #ccc;*/
  padding: 1rem;
  min-width: 1rem;
}

.calendar-days {
  grid-area: days;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(50px, auto);
}

.calendar-day {
  /*border: 1px solid #ccc;*/
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  cursor: pointer;
  min-width: 4rem;
  min-height: 4rem;
}

.selected-day {
  /*background-color: aquamarine;*/
  border: 2px solid blue;
}
</style>
