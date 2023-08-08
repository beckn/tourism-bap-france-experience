<template>
  <div id="payment">
    <div>
      <Location />
    </div>
    <div class="top-bar header-top">
      <div @click="goBack" class="sf-chevron--left sf-chevron icon_back">
        <span class="sf-search-bar__icon">
          <SfIcon color="var(--c-primary)" size="20px" icon="chevron_left" />
        </span>
      </div>
      <div class="">Select Payment Method</div>
    </div>
    <div v-if="enableLoader" key="loadingCircle" class="loader-circle">
      <LoadingCircle :enable="enableLoader" />
    </div>
    <div class="details header-push">
      <div class="sub-heading">
        <div class="p-name">Payment</div>
      </div>
      <Card v-if="order.cart">
        <div v-for="(value, bppId) in order.cart.quoteItem" :key="bppId">
          <div :key="providerId" v-for="(valuePerProvider, providerId) in value" class="address-text bold">
            <div :key="id" v-for="(breakup, id) in valuePerProvider.breakup">
              <CardContent class="flex-space-bw">
                <div class="address-text">
                  {{ breakup.title }}
                </div>
                <div class="address-text">
                  €
                  {{ formatPrice(parseFloat(breakup.price.value).toFixed(2)) }}
                </div>
              </CardContent>
            </div>
            <div>
              <hr class="sf-divider divider" />
            </div>
            <CardContent class="flex-space-bw">
              <div>Subtotal :</div>
              € {{ formatPrice(valuePerProvider.price.value) }}
            </CardContent>
          </div>
        </div>
        <div>
          <hr class="sf-divider divider" />
        </div>
      </Card>
      <div class="sub-heading">
        <div class="p-name">Other</div>
      </div>
      <Card v-show="isStudent">
        <CardContent>
          <div style="display:flex">
            <SfRadio class="sf-radio--transparent" :name="'Payment'" :value="'Student Culture Wallet'"
              label="Student Culture Wallet" :disabled="!availablebalance" :selected="paymentMethod"
              @change="changePaymentMethod" />

            <span style="position: relative; top: 16px;right:21px">
              <span v-show="availablebalance" class="badge">€273.00</span>
            </span>

            <span v-show="linkbtn" @click="showcost" class="link-text">Link</span>

            <span v-show="linkloder" class="loader"></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <!-- <div class="address-text color-def">Add Shipping Details</div> -->
          <SfRadio class="sf-radio--transparent" :name="'Payment'" :value="'Pay on arrival'" label="Pay on arrival"
            :disabled="false" :selected="paymentMethod" @change="changePaymentMethod" />
        </CardContent>
      </Card>

      <!-- <div class="p-name">Credit & Debit Cards</div>
      <div class="pay1">
        <SfImage
          src="/icons/cardpayment.svg"
          :width="273"
          :height="114"
          alt="Vue Storefront Next"
        />
      </div> -->
      <div class="sub-heading"></div>

      <div style="background:white;">
        <SfImage src="/icons/Credit & Debit cards 1.svg" :width="303" :height="215" alt="Vue Storefront Next" />
      </div>
      <div class="p-name">UPI</div>
      <div class="pay">
        <SfImage src="/icons/UPI 1.svg" :width="375" :height="257" alt="Vue Storefront Next" />
      </div>
    </div>
    <Footer class="footer-fixed" :buttonText="'Confirm'" :buttonEnable="isPayConfirmActive"
      :totalPrice="order.cart.totalPrice" :totalItem="cartGetters.getTotalItems(order.cart)"
      @buttonClick="proceedToConfirm">
      <template v-slot:buttonIcon>
        <svg width="25" height="19" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.0166 7.10181H23.0166M3.0166 1.10181H21.0166C22.1212 1.10181 23.0166 1.99724 23.0166 3.10181V15.1018C23.0166 16.2064 22.1212 17.1018 21.0166 17.1018H3.0166C1.91203 17.1018 1.0166 16.2064 1.0166 15.1018V3.10181C1.0166 1.99724 1.91203 1.10181 3.0166 1.10181Z"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </template>
    </Footer>
  </div>
</template>
<script>
import { SfButton, SfRadio, SfIcon, SfImage } from '@storefront-ui/vue';
import { useUiState } from '~/composables';

import {
  ref,
  computed,
  onBeforeMount,
  watch,
  onMounted
} from '@vue/composition-api';

import LoadingCircle from '~/components/LoadingCircle';
import { useCart, useConfirmOrder, cartGetters } from '@vue-storefront/beckn';
import Location from '../components/Location';

import Card from '~/components/Card.vue';

import Footer from '~/components/Footer.vue';
import CardContent from '~/components/CardContent.vue';
import helpers, { createConfirmOrderRequest } from '../helpers/helpers';

const { toggleCartSidebar } = useUiState();
export default {
  name: 'Payment',
  components: {
    SfImage,
    SfButton,
    SfIcon,
    Card,
    CardContent,
    SfRadio,
    Footer,
    LoadingCircle,
    Location
  },
  methods: {
    openCart() {
      toggleCartSidebar();
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  },
  setup(_, context) {
    const linkloder = ref(false);
    const availablebalance = ref(false);
    const paymentMethod = ref('');
    const order = ref({});
    const linkbtn = ref(true);
    const enableLoader = ref(false);
    const isStudent = ref(false);
    const showcost = () => {
      linkbtn.value = false;
      linkloder.value = true;
      setTimeout(() => {
        linkloder.value = false;
        availablebalance.value = true;
      }, 3000);
    };
    onMounted(() => {
      const shippingAddress = JSON.parse(
        localStorage.getItem('shipping_address')
      );
      const num = parseFloat(shippingAddress.age);
      isBetween18and22(num);
    });
    const isBetween18and22 = (num) => {
      if (num >= 18 && num <= 22) {
        isStudent.value = true;
      } else isStudent.value = false;
    };
    const isTransactionMatching = computed(() => {
      return order.value?.transactionId === context.root.$route.query.id;
    });

    const { init, poll, pollResults, stopPolling, polling } = useConfirmOrder(
      'confirm-order'
    );

    const changePaymentMethod = (value) => {
      paymentMethod.value = value;
    };

    const isPayConfirmActive = computed(() => {
      return paymentMethod.value !== '';
    });

    const setOrderHistory = (onConfirmResponse) => {
      // Next Line: To be removed after orderData flow is set
      order.value.order = onConfirmResponse[0].message.order;
      localStorage.setItem('orderId', onConfirmResponse[0].message.order.id);
      const parentOrderId = helpers.generateUniqueOrderId();
      const orderData = {};

      onConfirmResponse.forEach((onConfirmData) => {
        const currentOrderData = onConfirmData.message?.order;
        currentOrderData.bppId = onConfirmData.context?.bpp_id;
        if (currentOrderData) {
          orderData[currentOrderData.id] = currentOrderData;
        }
      });

      order.value.parentOrderId = parentOrderId;
      order.value.orderData = orderData;
      const orderHistory =
        JSON.parse(localStorage.getItem('orderHistory')) ?? [];
      orderHistory.push(order.value);

      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      const itemsInTheCart = JSON.parse(localStorage.getItem('cartData'));
      const shippingAddress = JSON.parse(
        localStorage.getItem('shipping_address')
      );

      const orderObjectPrsed = {
        context: {},
        message: {
          order: {
            id: localStorage.getItem('orderId'),
            created_at: helpers.getOrderPlacementTimeline(Date.now()),
            billing: {
              address: {
                street: shippingAddress.address
              }
            },
            item: [
              {
                descriptor: {
                  name: itemsInTheCart.items[0].descriptor.name,
                  images: itemsInTheCart.items[0].descriptor.images,
                  short_desc: itemsInTheCart.items[0].descriptor.short_desc
                },
                price: {
                  value: itemsInTheCart.items[0].price.value
                },
                quantity: itemsInTheCart.items[0].quantity,
                tags: {
                  fulfillment_end_loc:
                    itemsInTheCart.items[0].tags.fulfillment_end_loc,
                  fulfillment_end_time:
                    itemsInTheCart.items[0].tags.fulfillment_end_time,
                  fulfillment_start_loc:
                    '',
                  fulfillment_start_time:
                    ''
                },
                fulfillment: {
                  start: orderHistory[0].order.fulfillment.start,
                  end: orderHistory[0].order.fulfillment.end
                }
              }
            ]
          }
        }
      };

      localStorage.setItem('orderObject', JSON.stringify(orderObjectPrsed));

      context.root.$router.push({
        path: '/ordersuccess',
        query: {
          id: parentOrderId
        }
      });
    };

    const proceedToConfirm = async () => {
      enableLoader.value = true;
      console.log('order.valueeee', order.value)
      order.value.paymentMethod = paymentMethod.value;
      const params = createConfirmOrderRequest(
        order.value.transactionId,
        order.value.cart,
        order.value.shippingAddress,
        order.value.billingAddress,
        order.value.shippingAsBilling,
        '12.9063433,77.5856825',
        order.value.initOrder
      );

      try {
        const confirmResponses = await init(
          params,
          context.root.$store.state.token
        );

        setOrderHistory(confirmResponses[0].message.responses);
      } catch (error) {
        console.error(`error in confirm response ${error}`)
      }
    };

    const goBack = () => context.root.$router.back();



    onBeforeMount(() => {
      order.value = JSON.parse(localStorage.getItem('orderProgress'));
      if (!isTransactionMatching.value) {
        context.root.$router.push('/');
      }
    });
    return {
      paymentMethod,
      changePaymentMethod,
      order,
      cartGetters,
      isPayConfirmActive,
      proceedToConfirm,
      isTransactionMatching,
      enableLoader,
      goBack,
      linkloder,
      showcost,
      availablebalance,
      linkbtn,
      isBetween18and22,
      isStudent
    };
  }
};
</script>
<style lang="scss" scoped>
.top-bar {
  align-items: center;
  display: flex;
  font-size: 18px;
  justify-content: space-around;
  height: 60px;
  font-weight: 500;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.07);
}

.icon_back {
  position: absolute;
  left: 0;
  margin: 10px;
}

.badge {
  background: #387f9a;
  background: #387f9a;
  border-radius: 10px;
  padding: 3px 10px 3px 10px;
  color: #fbfcff;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  position: absolute;
  /* identical to box height */

  letter-spacing: 0.6px;
}

.loader {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: relative;
  top: 18px;
  animation: rotate 1s linear infinite;
}

.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 2px solid #387f9a;
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }

  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }

  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }

  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }

  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}

.details {
  margin: 2px 20px;
  height: calc(100vh - 130px);
  overflow-y: auto;
  overflow-x: hidden;
}

.p-name {
  font-size: 16px;
  font-weight: 600;
  color: #37474f;
}

.link-text {
  position: relative;
  top: 16px;
  //font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #387f9a;
}

.sub-heading {
  margin: 16px 0px;
  display: flex;
  justify-content: space-between;
}

.pay {
  background: white;
  left: -24px;
  position: relative;
}

.loader-circle {
  width: 100%;
  position: fixed;
  z-index: 1;
  // top: 130px;
  left: 0;
  height: 95vh;
}

.flex-space-bw {
  justify-content: space-between;
}
</style>
