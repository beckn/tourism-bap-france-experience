<template>
  <div>
    <div id="home" class="home-page">
      <OpenSearch />
      <div @click="openCart"></div>
    </div>
  </div>
</template>
<script>
import OpenSearch from '../components/OpenSearch';
import { useUiState } from '~/composables';
import { onBeforeMount, onMounted } from '@vue/composition-api';
import helpers from '../helpers/helpers';
import { useCart } from '@vue-storefront/beckn';

const { toggleCartSidebar } = useUiState();
export default {
  name: 'Home',
  components: {
    OpenSearch
  },
  methods: {
    openCart() {
      toggleCartSidebar();
    }
  },
  setup() {
    const { load, clear } = useCart();

    onBeforeMount(() => {
      clear();
      localStorage.clear();
    });

    onMounted(() => {
      if (localStorage.getItem('cartData')) {
        const cartData = JSON.parse(localStorage.getItem('cartData'));
        const days = helpers.calculateDays(cartData.cartTime, new Date());
        if (days > 7) {
          console.log('removed');
          // localStorage.removeItem('cartData');
          // localStorage.removeItem('transactionId');
        }
      }
      load();
    });
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  height: 100vh;

  position: fixed;
  width: 100%;
  background-image: url('/icons/Kedarkantha-Peak.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
}
.header {
  z-index: 1;
}
</style>
