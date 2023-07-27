/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable camelcase */
import { cartGetters } from '@vue-storefront/beckn';

export const calculateDays = (_date1, _date2) => {
  const date1 = new Date(_date1);
  const date2 = new Date(_date2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Returns the Billing address Info in a format required for the api
 * @param billingAddress Billing Address object
 */
export const getBillingInfo = (billingAddress, addresskey: string): any => {
  if (!billingAddress) {
    return {};
  }

  const billingInfo = {
    [addresskey]: {
      door: billingAddress.landmark,
      country: 'IND',
      city: billingAddress.city,
      street: billingAddress.billingAddress,
      area_code: billingAddress.pincode,
      state: billingAddress.state,
      building: billingAddress.building
    },
    phone: billingAddress.mobile,
    name: `./${billingAddress.name}/////`,
    email: 'testemail1@mailinator.com'
  };

  return billingInfo;
};

/**
 * Returns the Delivery address info in a format required for the api
 * @param shippingAddress Shipping Address object
 * @param gps Gps co-ordinates
 */
const getDeliveryInfo = (shippingAddress, gps): any => {
  if (!shippingAddress) {
    return {};
  }

  const deliveryInfo = {
    type: 'HOME-DELIVERY',
    name: `./${shippingAddress.name}/////`,
    phone: shippingAddress.mobile,
    email: 'testemail1@mailinator.com',
    location: {
      address: {
        door: shippingAddress.landmark,
        country: 'IND',
        city: shippingAddress.city,
        street: shippingAddress.address,
        area_code: shippingAddress.pincode,
        state: shippingAddress.state,
        building: shippingAddress.building
      },
      gps: gps
    }
  };

  return deliveryInfo;
};

export const createOrderRequest = (
  transactionId,
  cart,
  shippingAddress,
  billingAddress,
  shippingAsBilling,
  gps
) => {
  const bAddress = getBillingInfo(
    shippingAsBilling ? shippingAddress : billingAddress,
    'address'
  );

  const deliveryInfo = getDeliveryInfo(shippingAddress, gps);

  const cartItemsPerBppPerProvider = cartGetters.getCartItemsPerBppPerProvider(
    cart
  );

  const initOrderRequest = {
    initRequestDto: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: cart.items[0].bpp.id,
          bpp_uri: cart.bpp_uri,
          domain: 'tourism'
        },
        message: {
          order: {
            provider: {
              id: cart.items[0].bppProvider.id,
              locations: [
                {
                  id: cart.items[0].location_id
                }
              ]
            },
            items: [
              {
                quantity: {
                  count: 1
                },
                id:
                  './retail.kirana/ind.blr/17592186046815@mandi.succinct.in.item'
              }
            ],
            addOns: [],
            offers: [],
            billing: bAddress,
            fulfillment: {
              type: deliveryInfo.type,
              end: {
                location: deliveryInfo.location,
                contact: {
                  phone: deliveryInfo.phone,
                  email: deliveryInfo.email
                }
              },
              customer: {
                person: {
                  name: deliveryInfo.name
                }
              },
              id: cart.items[0].bppProvider.id
            }
          }
        }
      }
    ]
  };

  return initOrderRequest;
};

export const createConfirmOrderRequest = (
  transactionId: string,
  cart,
  shippingAddress,
  billingAddress,
  shippingAsBilling: boolean,
  gps,
  initOrderData
) => {
  const billingInfo = getBillingInfo(
    shippingAsBilling ? shippingAddress : billingAddress,
    'billingInfo'
  );
  const deliveryInfo = getDeliveryInfo(shippingAddress, gps);

  const cartItemsPerBppPerProvider = cartGetters.getCartItemsPerBppPerProvider(
    cart
  );

  const confirmOrderRequest = {
    confirmRequestDto: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: cart.items[0].bpp.id,
          bpp_uri: cart.bpp_uri,
          domain: 'tourism'
        },
        message: {
          order: {
            provider: {
              id: cart.items[0].bppProvider.id
            },
            items: [
              {
                quantity: {
                  count: cart.items[0].quantity
                },
                id: cart.items[0].id
              }
            ],
            addOns: [],
            offers: [],
            billing: {
              name: billingInfo.name,
              phone: billingInfo.phone,
              address: billingInfo.billingInfo,
              email: billingInfo.email
            },
            fulfillment: {
              type: deliveryInfo.type,
              end: {
                location: deliveryInfo.location,
                contact: {
                  phone: deliveryInfo.phone,
                  email: deliveryInfo.email
                }
              },
              customer: {
                person: {
                  name: deliveryInfo.name
                }
              },
              id: initOrderData.fulfillment.id
            },
            payment: {
              params: initOrderData.params,
              type: initOrderData.payment.type,
              status: initOrderData.payment.status
            }
          }
        }
      }
    ]
  };

  return confirmOrderRequest;
};

/**
 * Generic method for creating the Request Body for status, track and support api's.
 * @param orderValue The orderData stored in Localstorage
 * @param idKey String Key which we need to set with the orderId in each request
 * @returns Request body for the api
 */
export const createStatusTrackAndSupportOrderRequest = (
  orderValue,
  idKey,
  requestDtoName,
  orderObject
) => {
  const { transactionId, orderData } = orderValue;

  const request = {
    [requestDtoName]: [
      {
        context: {
          bpp_id: orderValue.order.bppId,
          bpp_uri: orderValue.cart.bpp_uri,
          transaction_id: transactionId,
          domain: 'tourism'
        },
        message: {
          [idKey]: orderValue.order.id
        },
        order_object: orderObject
      }
    ]
  };
  return request;
};

/**
 * Returns a comma separated string of message_id,extracted from each of the response context.
 * @param responseArr Array of response which is of the form responseArr[i].context.message_id
 * @returns messageIds
 */
export const getMessageIdsFromResponse = (responseArr) => {
  let messageIds = '';
  if (responseArr) {
    responseArr.forEach((response) => {
      if (response.context?.message_id) {
        messageIds += response.context?.message_id + ',';
      }
    });
    messageIds = messageIds.substring(0, messageIds.length - 1);
  }

  return messageIds;
};

export const getOrderPlacementTimeline = (timeStamp: string) => {
  const localDateAndTime = new Date(timeStamp);
  const localTime = localDateAndTime.toLocaleTimeString();
  const localDate = localDateAndTime.toDateString();
  const localDateWithoutDay = localDate
    .split(' ')
    .slice(1)
    .join(' ');

  return `${localDateWithoutDay}, ${localTime}`;
};

/**
 * Checks each object in the array if data present or not. If data is present in all of the objects,
 * then the UI should stop polling for data and so the function will return true or else will return false
 * and UI should continue polling the data.
 * @param responseArr Response array received from the api call
 * @param stopObjectKey the 'key' of the object which we need to check for value present or not
 * @returns true if all the objects have data or else false
 */
const shouldStopPooling = (responseArr, stopObjectKey) => {
  let shouldStopPolling = true;
  for (const response of responseArr) {
    if (!response.message?.[stopObjectKey]) {
      shouldStopPolling = false;
      break;
    }
  }

  return shouldStopPolling;
};

/**
 * Generates a unique order id starting with '1' and therby incrementing the id by one.
 * Temporary hack until the api returns a unique Orderid for entire order.
 * @returns string as the id number
 */
const generateUniqueOrderId = () => {
  const currentOrderId = localStorage.getItem('currentOrderId') || '0';

  const updatedOrderId = String(parseInt(currentOrderId) + 1);
  localStorage.setItem('currentOrderId', updatedOrderId);
  return updatedOrderId;
};

export const getMoreItemsOfOrderFromcartItems = (order, selectMoreItemsId) => {
  order.cart.items.forEach((item) => {
    order.orderData[selectMoreItemsId].items.filter((i) => item.id === i.id);
  });

  return order.cart.items;
};

const toBinary = (objectString) => {
  const codeUnits = Uint16Array.from(
    { length: objectString.length },
    (element, index) => objectString.charCodeAt(index)
  );
  const charCodes = new Uint8Array(codeUnits.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
};

const fromBinary = (binary) => {
  const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
    binary.charCodeAt(index)
  );
  const charCodes = new Uint16Array(bytes.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
};

const helpers = {
  calculateDays,
  getMessageIdsFromResponse,
  getOrderPlacementTimeline,
  shouldStopPooling,
  getMoreItemsOfOrderFromcartItems,
  generateUniqueOrderId,
  toBinary,
  fromBinary
};

export default helpers;
