<template>
  <div class="Product-container" id="product">
    <div>
      <Location />
    </div>
    <div @click="goBack" class="sf-chevron--left sf-chevron icon_back">
      <span class="sf-search-bar__icon">
        <SfIcon color="var(--c-primary)" size="20px" icon="chevron_left" />
      </span>
    </div>

    <div>
      <div>
        <img class="product-description-image" v-bind:src="images" alt="product img" />
      </div>
      <div class="head-container">
        <h1 class="head-title">{{ productGetters.getName(product) }}</h1>
      </div>

      <div class="trek-description-container">
        <!-- <div>
          <span class="Itinerary-text">Itinerary</span>
        </div> -->
        <div class="descriptor-body" v-html="product.descriptor.long_desc">
          <!-- <div v-html="product.tags.fulfillment_start_time" class="trek-description-container"></div> -->
        </div>
      </div>

      <div class="product__info">
        <div class="product__header">
          <SfHeading :title="productGetters.getName(product)" :level="3"
            class="sf-heading--no-underline sf-heading--left" />
        </div>
        <br />
        <br />
        <div class="bottom-bar-cart">
          <BookNow :totalPrice="Math.abs(product.price.value)" :key="keyVal + 'product-page'"
            :value="cartGetters.getItemQty(isInCart({ product }))" @updateItemCount="updateCart" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAccordion,
  SfIcon,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfReview,
  SfBreadcrumbs,
  SfButton,
  SfColor
} from '@storefront-ui/vue';
import Location from '../components/Location'
import AddToCart from '~/components/AddToCart.vue';
import BookNow from '~/components/BookNow.vue';
import ImagesScroll from '~/components/ImagesScroll.vue';
import SfAccordionItem from '~/components/Accordion.vue';
import Footer from '~/components/Footer';
import { useUiState } from '~/composables';
import { useCart, cartGetters, productGetters } from '@vue-storefront/beckn';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { onBeforeMount, ref, watch } from '@vue/composition-api';
import helpers from '../helpers/helpers';

export default {
  name: 'Product',
  transition: 'fade',

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const { toggleSearchVisible, clearCartPopup } = useUiState();
    const keyVal = ref(0);

    toggleSearchVisible(false);

    watch(
      () => clearCartPopup.value,
      (newVal) => {
        if (!newVal) {
          keyVal.value++;
        }
      }
    );

    const data = context.root.$route.query.data;
    const decoded = atob(data);
    const original = helpers.fromBinary(decoded);
    const { product, bpp, bppProvider, locations } = JSON.parse(original);

    const { addItem, cart, load, isInCart } = useCart();

    const images = productGetters.getImages(product);
    const goBack = () => {
      toggleSearchVisible(true);
      context.root.$router.back();
    };

    const updateCart = async (value) => {
      addItem({
        product: product,
        quantity: value,
        customQuery: {
          bpp: bpp,
          bppProvider: bppProvider,
          locations: locations
        }
      });
      context.root.$router.push('/cart');
    };

    onBeforeMount(async () => {
      await load();
    });

    return {
      images,
      goBack,
      cart,
      updateCart,
      product,
      toggleSearchVisible,
      productGetters,
      isInCart,
      cartGetters,
      keyVal
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfIcon,
    SfImage,
    AddToCart,
    SfBanner,
    SfSticky,
    SfReview,
    SfBreadcrumbs,
    SfButton,
    MobileStoreBanner,
    LazyHydrate,
    SfAccordionItem,
    SfAccordion,
    ImagesScroll,
    Footer,
    BookNow,
    Location
  }
};
</script>

<style lang="scss" scoped>
.trek-description-container {
  display: block;
  width: 82%;
  margin: auto;
}

.Itinerary-text {
  font-weight: 700;
}

.product-info-container {
  margin-left: 15px;
}

.product-description-image {
  position: relative;
  width: 100%;
  height: 197px;
}

.prod-info {
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  margin-top: 5px;

  @include for-desktop {
    margin-top: 10px;
  }

  tr {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);

    &:first-child {
      border-top: thin solid rgba(0, 0, 0, 0.12);
    }
  }

  th,
  td {
    font-weight: 400;
    font-size: 0.875rem;
    height: 48px;
    padding: 0 10px;

    &.prod-info-child-td {
      padding: 0;
    }
  }

  th {
    background: #eee;
    font-weight: 500;
    width: 50%;
    word-break: break-word;
  }
}

.prod-info-child {
  @extend .prod-info;
  margin-top: 0;

  tr {
    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

#product {
  box-sizing: border-box;

  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.icon_back {
  position: absolute;
  margin: 15px;
  z-index: 2;

  .sf-icon {
    --icon-color: #387f9a !important;
    width: 20px;
    height: 20px;
  }

  // width:100%;
}

.bottom-bar-cart {
  // display: flex;
  // justify-content: space-around;
  // margin-bottom: 0px;
  // box-shadow: 0px -5px 40px rgba(0, 0, 0, 0.15);
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;

  .cart-checkout {
    background: #387f9a;
  }

}

.sf-accordion.product__tabs.has-chevron {
  margin-top: 0 !important;
  margin-bottom: 5px;

  @include for-desktop {
    margin-bottom: 10px;
  }
}

.divider {
  width: 90%;
  margin: auto;
}

.s-p-price {
  color: #387f9a;
  font-size: 22px;
}

.product {
  @include for-desktop {
    display: flex;
  }

  &__image {
    img {
      object-fit: contain !important;
    }
  }

  &__info {
    margin: var(--spacer-sm) auto;

    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }

  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;

    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }

  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    display: flex;
    justify-content: space-between;

    @include for-desktop {
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }

  &__count {
    @include font(--count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary));
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }

  &__description {
    @include font(--product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary));
  }

  &__select-size {
    margin: 0 var(--spacer-sm);

    @include for-desktop {
      margin: 0;
    }
  }

  &__colors {
    @include font(--product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary));
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }

  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }

  &__color {
    margin: 0 var(--spacer-2xs);
  }

  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;

    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }

  &__compare {
    margin-top: 0;
  }

  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);

    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;

    &__button {
      --button-font-size: var(--font-size--base);
    }
  }

  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }

  &__additional-info {
    color: var(--c-link);
    @include font(--additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary));

    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);

      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }

    &__paragraph {
      margin: 0;
    }
  }

  &__gallery {
    flex: 1;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

.head-title {
  font-size: 1.2rem;
  letter-spacing: -0.36px;
  color: #387f9a;
}

.head-container {
  /* padding: 18px 22px; */
  padding-left: 9%;
  padding-top: 26px;
  padding-bottom: 7px;
}

.product__header {
  display: none;
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, 30%, 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
