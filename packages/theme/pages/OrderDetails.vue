<template>
  <div>
    <div>
      <Location />
    </div>
    <div class="top-bar">
      <div class="header-push" style="    padding-left: 5%;">
        Booking Details
      </div>
      <div>
        <CopyOrderDropdownContent @openQR="toggleQR" />
      </div>
    </div>

    <div v-if="enableLoader" key="loadingCircle" class="loader-circle">
      <LoadingCircle :enable="enableLoader" />
    </div>

    <div v-if="!enableLoader" class="details">
      <Card>
        <SfAccordion>
          <h5 style="color:#387f9a;font-size: 17px;
                        font-weight: 500;">
            My Trip
          </h5>
          <CardContent class="flex-space-bw">
            <div class="address-text"><span>Booked on</span></div>
            <div class="order-desrciption order-id">
              <span>{{ orderPlacementTime }}</span>
            </div>
          </CardContent>
          <div>
            <hr class="sf-divider divider" />
          </div>
          {{ log('order', order.value) }}

          <div :key="orderId" v-for="(order, orderId, index) in order.orderData" class="shipment-wrapper">
            <!-- <CardContent class="flex-space-bw">
                <div class="address-text">
                  <span>Order Id {{ index + 1 }}</span>
                </div>
                <div class="address-text">
                  <span>Id - {{ orderId }}</span>
                </div>
              </CardContent> -->

            <CardContent class="flex-space-bw">
              <div class="order-desrciption">
                {{ productName }} x
                {{ order.items[0].quantity.count }}
              </div>
              <div class="address-text-items">
                <span>Id - {{ parentOrderIdOfTheCurentOrder }}</span>
              </div>
            </CardContent>
            <CardContent v-if="orderStatusData && orderStatusData[index]" class="flex-space-bw">
              <div class="address-text"><span>Status</span></div>
              <div class="status-text">
                <span>
                  Confirmed
                </span>
              </div>
            </CardContent>
            <CardContent class="flex-space-bw">
              <div v-if="order.items.length > 1">
                <div @click="
                  openItemsModal = true;
                selectMoreItemsId = orderId;
                " class="more-items-button">
                  <span class="more-items-text">{{ order.items.length - 1 }} more items</span>
                </div>
              </div>
            </CardContent>

            <!-- <div class="order-buttons-wrapper">
                <SfButton class="sf-button--pure" @click="
                  openTrackModal = true;
                selectedTrackingId = index;
                                    ">
                  <div class="color-def">Track</div>
                </SfButton>

                <SfButton class="sf-button--pure" @click="
                  openSupportModal = true;
                selectedSupportId = index;
                                    ">
                  <div class="color-def">Support</div>
                </SfButton>
              </div> -->
            <!-- <div>
                <hr class="sf-divider divider" />
              </div> -->
          </div>
        </SfAccordion>
      </Card>

      <div class="sub-heading"></div>

      <Card>
        <SfAccordion>
          <h5 style="color:#387f9a;font-size: 17px;
                        font-weight: 500;">
            Traveller Details
          </h5>
          <AddressCard :name="order.shippingAddress.name" :address="order.shippingAddress.address"
            :mobile="order.shippingAddress.mobile" :building="order.shippingAddress.building"
            :pincode="order.shippingAddress.pincode" :age="parseFloat(order.shippingAddress.age)" />
        </SfAccordion>
      </Card>

      <div class="sub-heading"></div>

      <Card>
        <SfAccordion>
          <h5 style="color:#387f9a;font-size: 17px;
                        font-weight: 500;">
            Payment
          </h5>
          <div :key="orderId" v-for="(value, orderId) in order.orderData">
            <div :key="id" v-for="(breakup, id) in value.quote.breakup">
              <CardContent class="flex-space-bw">
                <div class="address-text">{{ breakup.title }}</div>

                <div class="address-text-value">
                  € {{ formatPrice(breakup.price.value) }}
                </div>
              </CardContent>
            </div>
            <div>
              <hr class="sf-divider divider" />
            </div>
            <CardContent class="flex-space-bw">
              <div class="address-text">Subtotal</div>
              <div class="address-text-value">
                € {{ formatPrice(value.quote.price.value) }}
              </div>
            </CardContent>
            <CardContent class="flex-space-bw">
              <div class="address-text">Status</div>
              <div class="address-text-value">
                {{
                  value.payment.status.charAt(0).toUpperCase() +
                  value.payment.status.slice(1).toLowerCase()
                }}
              </div>
            </CardContent>
          </div>
          <CardContent class="flex-space-bw">
            <div class="address-text">Method</div>
            <div class="address-text-value">{{ order.paymentMethod }}</div>
          </CardContent>
          <div></div>
        </SfAccordion>
      </Card>
      <div class="sub-heading"></div>
      <Card>
        <SfAccordion>
          <h5 style="color:#387f9a;font-size: 17px;
                        font-weight: 500;">
            Open in Wallet
          </h5>
          <CardContent class="flex-space-bw">
            <div class="open-wallet-QR-container">
              <qrcode-vue :value="`https://experience-guide-staging.becknprotocol.io/wallet?${encodedOrderDetails}`
                " size="200" level="L" />
            </div>
          </CardContent>
        </SfAccordion>
      </Card>
      <div class="sub-heading"></div>
      <Card>
        <SfAccordion>
          <SfAccordionItem :header="'View JSON'">
            <!-- <h5 style="color:#387f9a;font-size: 17px;
              font-weight: 500;">
            View JSON
          </h5> -->
            <CardContent class="flex-space-bw">
              <div class="open-wallet-QR-container">
                <qrcode-vue :value="orderObjectForQR" size="200" level="L" />
              </div>
            </CardContent>
          </SfAccordionItem>
        </SfAccordion>
      </Card>

      <div class="sub-heading"></div>

      <div class="sub-heading"></div>

      <button class="sf-button color-primary support-btns card-checkbox" @click="goHome">
        <div class="f-btn-text">Home</div>
      </button>

      <ModalSlide :visible="openSupportModal" @close="
        openSupportModal = false;
      selectedSupportId = null;
      ">
        <div class="modal-heading">Contact Support</div>
        <div>
          <hr class="sf-divider" />
        </div>
        <div class="modal-body">
          <div v-if="supportData && supportData[selectedSupportId]">
            <div class="support-text">
              You can reach out to one of our customer support executives for
              any help, queries or feedback to
              {{
                providerGetters.getProviderName(
                  cartGetters.getBppProvider(order.cart)
                )
              }}
            </div>
            <SfButton class="support-btns" v-if="supportData[selectedSupportId].phone"
              @click="openWindow('tel:' + supportData[selectedSupportId].phone)" aria-label="Close modal" type="button">
              Call us</SfButton>
            <SfButton class="support-btns" v-if="supportData[selectedSupportId].email" @click="
              openWindow('mailto:' + supportData[selectedSupportId].email)
              " aria-label="Close modal" type="button">Email us</SfButton>
            <SfButton class="support-btns" v-if="supportData[selectedSupportId].uri"
              @click="openWindow(supportData[selectedSupportId].uri)" aria-label="Close modal" type="button">Chat with us
            </SfButton>
          </div>
          <div v-else class="support-text">
            No Support available at the moment
          </div>
        </div>
      </ModalSlide>

      <ModalSlide :visible="openTrackModal" @close="
        openTrackModal = false;
      selectedTrackingId = null;
      ">
        <div class="modal-heading">Track</div>
        <div>
          <hr class="sf-divider" />
        </div>
        <div class="modal-body">
          <div v-if="!trackingData[selectedTrackingId]" class="support-text">
            No Tracking details available
            <!-- {{
              providerGetters.getProviderName(
                cartGetters.getBppProvider(order.cart)
              )
            }} -->
          </div>
          <div v-else>
            <SfButton class="support-btns" aria-label="Close modal" type="button"
              @click="openWindow(trackingData[selectedTrackingId])">open Link</SfButton>
          </div>
          <!-- <SfButton class="support-btns" aria-label="Close modal" type="button"
            >Call us</SfButton
          >
          <SfButton class="support-btns" aria-label="Close modal" type="button"
            >Chat with us</SfButton
          > -->
        </div>
      </ModalSlide>

      <ModalSlide :visible="openItemsModal" @close="
        openItemsModal = false;
      selectMoreItemsId = null;
      ">
        <div class="modal-heading">Ordered Items</div>
        <div>
          <hr class="sf-divider" />
        </div>
        <div class="modal-body">
          <CardContent class="flex-space-bw">
            <div class="address-text">
              <span>Order Id 1</span>
            </div>
            <div class="address-text order-id">
              <span>Id - {{ selectMoreItemsId }}</span>
            </div>
          </CardContent>
          <div v-if="selectMoreItemsId !== null">
            <CardContent class="more-items-flex">
              <div v-for="(product, index) in getMoreItems(
                    order,
                    selectMoreItemsId
                  )" :key="index" class="item-wrapper">
                <div class="s-p-image">
                  <SfImage :src="cartGetters.getItemImage(product)" alt="product img" :width="85" :height="90" />
                </div>
                <div class="s-p-details">
                  <div class="s-p-name">
                    {{ cartGetters.getItemName(product) }}
                  </div>
                  <div class="s-p-retailer">
                    sold by
                    {{
                      providerGetters.getProviderName(
                        cartGetters.getBppProvider(product)
                      )
                    }}
                  </div>
                  <div class="s-p-weight">x {{ product.quantity }}</div>
                  <div class="s-p-price">
                    €
                    {{
                      formatPrice(
                        cartGetters.getItemPrice(product).regular *
                        product.quantity
                      )
                    }}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
          <button class="sf-button color-primary support-btns" @click="openItemsModal = false">
            <div class="f-btn-text">Okay</div>
          </button>
        </div>
      </ModalSlide>
      <ModalSlide :visible="openQR" @close="toggleQR">
        <div class="modal-heading">Scan QR</div>
        <div>
          <hr class="sf-divider" />
        </div>

        <div class="modal-body">
          <div class="support-text" style="text-align: center;">
            Scan this QR <br />
            to Import this order another app
          </div>
          <br />
          <div style="display: flex; align-items: center; justify-content: center;">
            <!-- <SfImage alt="copypast" class="e" src="/icons/QR.png" /> -->
            <qrcode-vue :value="`https://experience-guide-staging.becknprotocol.io/SelectionPage??external_url=${orderObjectFetchUrl}`
              " size="200" level="L" />
          </div>
          <br />
          <div style="display: flex; align-items: center; justify-content: space-evenly;">
            <div>
              <SfImage width="60px" height="60px" alt="copypast" class="e" src="/icons/ONDC_logo.png" />
            </div>
            <div>
              <SfImage width="43px" height="61px" alt="copypast" class="e" src="/icons/openKochi.png" />
            </div>
            <div>
              <SfImage width="63px" height="19px" alt="copypast" class="e" src="/icons/beckn_main_scanner.png" />
            </div>
          </div>
        </div>
      </ModalSlide>
    </div>
  </div>
</template>
<script>
import {
  SfSteps,
  SfSidebar,
  SfButton,
  SfModal,
  SfCheckbox,
  SfAccordion,
  SfImage,
  SfInput,
  SfIcon,
  SfDropdown,
  SfList,
  SfListItem
} from '@storefront-ui/vue';
import Location from '../components/Location';
import ModalSlide from '~/components/ModalSlide.vue';
import LoadingCircle from '~/components/LoadingCircle';
import SfAccordionItem from '~/components/Accordion.vue';
import AddressInputs from '~/components/AddressInputs.vue';
import Footer from '~/components/Footer.vue';
import {
  cartGetters,
  providerGetters,
  useTrack,
  useOrderStatus,
  useSupport,
  useCart
} from '@vue-storefront/beckn';

import {
  ref,
  onBeforeMount,
  computed,
  onBeforeUnmount
} from '@vue/composition-api';
import QrcodeVue from 'qrcode.vue';
import Card from '~/components/Card.vue';
import CardContent from '~/components/CardContent.vue';
import AddressCard from '~/components/AddressCard';
import helpers, {
  createStatusTrackAndSupportOrderRequest
} from '../helpers/helpers';
import Dropdown from '../components/Dropdown.vue';
import CopyOrderDropdownContent from '../components/CopyOrderDropdownContent.vue';

export default {
  name: 'OrderDetails',
  components: {
    Location,
    SfButton,
    SfSteps,
    SfSidebar,
    SfModal,
    SfCheckbox,
    Footer,
    ModalSlide,
    SfInput,
    Card,
    SfImage,
    CardContent,
    AddressInputs,
    SfAccordion,
    SfAccordionItem,
    SfIcon,
    LoadingCircle,
    AddressCard,
    helpers,
    SfDropdown,
    SfList,
    SfListItem,
    Dropdown,
    CopyOrderDropdownContent,
    QrcodeVue
  },
  setup(_, context) {
    const order = ref(null);
    const orderPlacementTime = ref(null);
    const enableLoader = ref(true);
    const selectedTrackingId = ref(null);
    const selectedSupportId = ref(null);
    const selectMoreItemsId = ref(null);
    const statusResult = ref(null);
    const supportResult = ref(null);
    const trackResult = ref(null);
    const { clear } = useCart();
    const openQR = ref(false);
    const parentOrderIdOfTheCurentOrder = ref('');
    const toggleQR = () => {
      openQR.value = !openQR.value;
    };
    const orderObjectFetchUrl = ref('');

    const exportingOrderObject = JSON.parse(
      localStorage.getItem('orderObject')
    );
    const productName =
      exportingOrderObject.message.order.item[0].descriptor.name;

    const orderObjectForQR = JSON.stringify(exportingOrderObject, undefined, 2);
    const encodedOrderDetails = localStorage.getItem('encodedOrderDetails');

    const { init: track, stopPolling: stopPollingOnTrack } = useTrack('track');
    const { init: support, stopPolling: stopPollingSupport } = useSupport(
      'support'
    );

    const { init: status } = useOrderStatus('status');

    const trackingData = computed(() => {
      if (!trackResult.value) {
        return null;
      }

      let shouldStopPooling = true;
      const trackingData = {};
      trackResult.value.forEach((currentTrackData, index) => {
        if (currentTrackData.message?.tracking?.url) {
          trackingData[index] = currentTrackData.message.tracking.url;
        } else {
          shouldStopPooling = false;
        }
      });

      if (shouldStopPooling) {
        stopPollingOnTrack();
      }

      return trackingData;
    });

    const orderStatusData = computed(() => {
      if (!statusResult.value) {
        return null;
      }

      const orderStatusData = {};
      statusResult.value.forEach((currentStatusData, index) => {
        if (currentStatusData.message?.order) {
          orderStatusData[index] = currentStatusData.message.order;
          orderObjectFetchUrl.value = currentStatusData.qr_url;
        }
      });

      return orderStatusData;
    });

    const showFulfillmentProgress = computed(() => {
      if (!statusResult.value) {
        return null;
      }

      let showFulfillmentProgress = false;
      statusResult.value.forEach((currentStatusData) => {
        if (currentStatusData.message?.order?.fulfillment?.state) {
          showFulfillmentProgress = true;
        }
      });

      return showFulfillmentProgress;
    });

    const fulfillmentData = computed(() => {
      if (!statusResult.value) {
        return null;
      }

      const fulfillmentData = {};
      statusResult.value.forEach((currentStatusData, index) => {
        if (currentStatusData.message?.order) {
          fulfillmentData[index] = currentStatusData.message.order.fulfillment;
        }
      });

      return fulfillmentData;
    });

    const supportData = computed(() => {
      if (!supportResult.value) {
        return null;
      }

      let shouldStopPooling = true;
      const supportData = {};
      supportResult.value.forEach((currentSupportData, index) => {
        if (
          currentSupportData.message &&
          Object.keys(currentSupportData.message).length !== 0
        ) {
          supportData[index] = currentSupportData.message;
        } else {
          shouldStopPooling = false;
        }
      });

      if (shouldStopPooling) {
        stopPollingSupport();
      }

      return supportData;
    });

    const parentOrderId = context.root.$route.query.id;
    const fulfillmentStep = [
      { status: 'Items Packed', time: 'May 2021, 2021 12:40 PM' },
      { status: 'Delivery agent assigned', time: 'May 2021, 2021 12:40 PM' },
      { status: 'Agent enroute to store', time: 'May 2021, 2021 12:40 PM' },
      null,
      null,
      null,
      null
    ];
    const fulfillmentSteps = [
      { status: 'Items Packed', time: 'May 2021, 2021 12:40 PM' },
      { status: 'Delivery agent assigned', time: 'May 2021, 2021 12:40 PM' },
      { status: 'Agent enroute to store', time: 'May 2021, 2021 12:40 PM' }
    ];
    const openSupportModal = ref(false);
    const openTrackModal = ref(false);
    const openItemsModal = ref(false);
    let intervalId;
    const goHome = () => {
      localStorage.clear();
      context.root.$router.push('/');
    };
    const goBack = () => context.root.$router.push('/orders');
    const onCancel = () => context.root.$router.push('/cancelorder');

    const callSupport = async () => {
      const params = createStatusTrackAndSupportOrderRequest(
        order.value,
        'ref_id',
        'supportRequestDto'
      );
      try {
        const response = await support(params, context.root.$store.state.token);
        supportResult.value = response;
      } catch (error) {
        console.log('Error calling support apis - ', error);
      }
    };

    const callStatus = async () => {
      const params = createStatusTrackAndSupportOrderRequest(
        order.value,
        'order_id',
        'statusRequestDto',
        JSON.parse(localStorage.getItem('orderObject'))
      );
      try {
        const response = await status(params, context.root.$store.state.token);
        statusResult.value = response;
      } catch (error) {
        console.log('Error calling track apis - ', error);
      }
    };

    const callTrack = async () => {
      const params = createStatusTrackAndSupportOrderRequest(
        order.value,
        'order_id',
        'trackRequestDto'
      );
      try {
        const response = await track(params, context.root.$store.state.token);
        trackResult.value = response;
      } catch (error) {
        console.log('Error calling track apis - ', error);
      }
    };
    onBeforeMount(async () => {
      parentOrderIdOfTheCurentOrder.value = JSON.parse(
        localStorage.getItem('orderObject')
      ).message.order.id;
      const orders = JSON.parse(localStorage.getItem('orderHistory')) ?? [];

      order.value = orders.find((ord) => {
        return ord.parentOrderId === parentOrderId;
      });

      orderPlacementTime.value = helpers.getOrderPlacementTimeline(
        order.value.order?.created_at
      );

      await callStatus();
      await callTrack();
      await callSupport();
      enableLoader.value = false;
      localStorage.removeItem('orderProgress');
      localStorage.removeItem('transactionId');

      intervalId = setInterval(async () => {
        await callStatus();
      }, 1000);

      onBeforeUnmount(() => {
        clearInterval(intervalId);
      });
      clear();
    });

    const openWindow = (link) => {
      // debugger
      window.open(link);
    };
    const getMoreItems = helpers.getMoreItemsOfOrderFromcartItems;
    return {
      goHome,
      goBack,
      order,
      cartGetters,
      trackingData,
      selectedTrackingId,
      providerGetters,
      fulfillmentStep,
      fulfillmentSteps,
      openSupportModal,
      onCancel,
      enableLoader,
      openTrackModal,
      openItemsModal,
      callTrack,
      trackResult,
      openWindow,
      orderStatusData,
      fulfillmentData,
      showFulfillmentProgress,
      supportData,
      selectedSupportId,
      orderPlacementTime,
      selectMoreItemsId,
      getMoreItems,
      openQR,
      toggleQR,
      encodedOrderDetails,
      orderObjectForQR,
      productName,
      parentOrderIdOfTheCurentOrder,
      orderObjectFetchUrl,
      statusResult,
      supportResult
    };
  },
  methods: {
    log(exp, value) {
      console.log(exp, value);
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2).replace(',', '.');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};
</script>

<style lang="scss" scoped>
.open-wallet-QR-container {
  display: block;
  margin: auto;
}

.order-desrciption {
  margin-left: 4px;
  max-width: 50%;
}

.track-target {
  color: #387f9a;
}

.support-btns {
  width: 100%;
  border-radius: 3px;
}

.cancel-order-btn {
  width: 100%;
  border-radius: 3px;
}

.bold {
  font-weight: 600;
}

.card-checkbox {
  margin-bottom: 20px;
}

.sf-checkbox__checkmark:hover {
  --checkbox-border-color: transparent !important;
  border: 0;
}

.sf-input {
  input {
    font-size: 14px;

    &:placeholder {
      font-size: 14px;
    }
  }
}

.s-p-weight {
  margin-top: 6px;
  font-size: 14px;
  color: #8a8d8e;
}

.flex-space-bw {
  justify-content: space-between;
}

.details {
  padding: 20px;
  //height: calc(100vh - 149px);
  height: calc(100vh - 160px);
  overflow-y:auto ;
  overflow-x: hidden;
}

.address-bar-icon {
  margin: 10px 10px 1px 10px;
}

.address-text {
  align-self: center;
  margin-left: 6px;

  span {
    font-weight: 500;
  }
}

.address-text-items {
  display: flex;
  align-self: center;
  margin-left: 6px;

  span {
    font-weight: 500;
  }
}

.more-items-button {
  border: 1px solid #387f9a;
  border-radius: 6px;
  width: 100%;
}

.more-items-text {
  padding: 9px;
  color: #387f9a;
}

.sub-heading {
  margin: 14px 0px;
  display: flex;
  justify-content: space-between;
}

.footer {
  position: fixed;
  bottom: 0;
}

.address-text {
  font-weight: 600;
}

.address-text-value {
  font-weight: 400;
}

.icon_back {
  position: absolute;
  left: 0;
  margin: 10px;
}

.color-def {
  color: #387f9a;
}

.top-bar {
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
  // justify-content: space-around;
  height: 60px;
  font-weight: 500;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.07);
}

.p-name {
  font-size: 16px;
  font-weight: 600;
  color: #37474f;
}

#checkout {
  box-sizing: border-box;

  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}

.order-buttons-wrapper {
  padding-top: 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
}

.checkout-product:first-child {
  border-top: 0px solid rgba(0, 0, 0, 0.3);
}

.checkout-product {
  display: flex;
  margin-top: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding-bottom: 15px;

  &:first-child(2) {
    border-top: 0 !important;
  }

  .s-p-image {
    margin-right: 25px;
  }

  .s-p-name {
    font-size: 11px;
    color: #000;
  }

  .s-p-price {
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    color: #387f9a;
  }
}

.item-wrapper {
  display: flex;
  margin: 20px 0;

  .s-p-image {
    margin-right: 25px;
  }

  .s-p-name {
    font-weight: 700;
    font-size: 15px;
  }

  .s-p-retailer {
    padding-top: 5px;
    font-size: 13px;
  }

  .s-p-price {
    font-size: 16px;
    margin-top: 10px;
    color: #387f9a;
  }
}

.checkout {
  @include for-desktop {
    display: flex;
  }

  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }

  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }

  &__steps {
    --steps-content-padding: 0 var(--spacer-base);

    @include for-desktop {
      --steps-content-padding: 0;
    }

    &-auth::v-deep .sf-steps__step:first-child {
      --steps-step-color: #e8e4e4;
    }
  }
}

.more-items-flex {
  display: flex;
  flex-direction: column;
}

.modal-heading {
  margin: 20px;
  font-size: 20px;
  font-weight: 500;
}

.color-def {
  color: #387f9a;
}

.modal-body {
  padding: 28px;

  .support-text {
    font-size: 15px;
  }

  .support-btns {
    margin-top: 20px;
    width: 100%;
  }
}

.sf-loader {
  top: 40px;
}

.order-id {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shipment-wrapper {
  margin-top: 20px;
}

.step-number {
  line-height: 1;
}

.status-text {
  color: #5ec401;
  font-weight: 700;
}
</style>
