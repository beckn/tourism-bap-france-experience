<template>
  <!-- <transition name="dropdown-content-copy-order"> -->
  <!-- v-if="active" -->
  <div class="drop1">
    <div class="labels " @click="copyOrder">
      <SfImage
        alt="copypast"
        class="empty-cart__image"
        src="/icons/importOrderIcon.svg"
        width="22px"
        height="24px"
      />
      <!-- Copy Order -->
    </div>
    <div></div>
    <div class="labels" @click="$emit('openQR')">
      <SfImage
        alt="copypast"
        class="empty-cart__image"
        src="/icons/scan.svg"
        width="22px"
        height="24px"
      />
      <!-- Shop for Items -->
    </div>

    <!-- <div>
        <hr class="sf-divider" />
      </div> -->
  </div>
  <!-- </transition> -->
</template>

<script>
import { SfImage } from '@storefront-ui/vue';
export default {
  components: {
    SfImage
  },
  name: 'CopyOrderDropdownContent',
  inject: ['sharedState'],

  methods: {
    async copyOrder() {
      try {
        await navigator.clipboard.writeText(
          localStorage.getItem('orderObject')
        );
      } catch (error) {
        console.log('error', error);
        alert('Cannot copy');
      }
    }
  },

  setup(props, { root }) {
    const isUserAuthenticated = () => {
      if (root.$store.$fire.auth.currentUser === null) {
        return false;
      }
      return true;
    };

    return {
      isUserAuthenticated
    };
  },

  computed: {
    active() {
      return this.sharedState.active;
    }
  }
};
</script>

<style>
.drop1 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* position: absolute;
  right: 71px; */
  /* box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2); */
  /* z-index: 1; */
  width: 10rem;
  border-radius: 10px;
  top: 3px;
  /* // margin-top: 2.1rem; */
  /* margin-right: -0.4rem; */
  background: #fbfcff;
}

.labels {
  /* //font-size: 15px; */
  padding: 15px;
}

.rahul:hover {
  background: #387f9a;
  border-radius: 5px;
  color: #ffff;
}
</style>
