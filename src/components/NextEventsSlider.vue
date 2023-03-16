<template>
  <section class="d-flex flex-column justify-content-center align-items-center">
    <header class="h2 m-0">Next Events</header>
    <section class="carousel-wrapper">
      <Swiper
        :effect="'coverflow'"
        :grab-cursor="true"
        :space-between="10"
        :centered-slides="false"
        :slides-per-view="'auto'"
        :initial-slide="0"
        :coverflow-effect="{
          rotate: 50,
          // rotate: 0,
          stretch: 0,
          depth: 100,
          // modifier: 0,
          modifier: 1,
          // slideShadows: true,
          slideShadows: false,
        }"
        :pagination="{ clickable: true }"
        :modules="modules"
        class="mySwiper"
      >
        <SwiperSlide v-for="(item, index) in eventList" :key="index">
          <EventItem :item="item"></EventItem>
        </SwiperSlide>
      </Swiper>
    </section>
  </section>
</template>
<script>
import { computed } from 'vue';
import EventItem from '@/components/EventCard.vue';

// https://swiperjs.com/vue
import { Swiper, SwiperSlide } from 'swiper/vue'; // Import Swiper Vue.js components
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper'; // import required modules

export default {
  components: {
    EventItem,
    Swiper,
    SwiperSlide,
  },

  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const eventList = computed(() => [...props.events]);

    return {
      eventList,
      modules: [EffectCoverflow, Pagination],
    };
  },
};
</script>

<style scoped>
.carousel-wrapper {
  /*width: 75%;*/
  max-width: 940px;
}

.swiper {
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 300px;
}

.swiper-slide img {
  display: block;
  width: 100%;
}
</style>
