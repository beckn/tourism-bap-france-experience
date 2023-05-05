<template>
    <div class="s-footer">
        <div class="f-price-container">
            <div class="holder">
                <div class="f-total">Total</div>
                <div>
                    <span class="f-p-total">€ {{ formatPrice(totalPrice) }} </span>
                </div>
            </div>
        </div>

        <button class="sf-button f-button 'color-primary'" :disabled="false" link="" @click="changeItemNumber('add')">
            <slot name="buttonIcon" />
            <div class="f-btn-text">Book now</div>
            <SfIcon icon="chevron_right" color="white" :coverage="1" size="xxs" />
        </button>
    </div>
</template>
  
<script>
import { SfInput, SfIcon } from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';

export default {
    name: 'BookNow',
    components: {
        SfInput,
        SfIcon
    },
    props: {
        totalPrice: { type: Number },
        totalItem: { type: Number, default: 0 },
        value: { type: Number, default: 0 },
        maxLimit: { type: Number, default: 100 }
    },
    setup(props, { emit }) {
        const _value = ref(props.value);
        const _maxLimit = ref(props.maxLimit);
        const changeItemNumber = (type) => {
            if (type === 'add') {
                if (_maxLimit.value) {
                    if (_value.value < _maxLimit.value) {
                        _value.value++;
                    }
                } else {
                    _value.value++;
                }
            } else if (type === 'remove') {
                if (_value.value > 0) {
                    _value.value--;
                }
            }
            emit('updateItemCount', _value.value);
        };
        return {
            _value,
            _maxLimit,
            changeItemNumber
        };
    },
    methods: {
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace(',', '.');
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
};
</script>
<style lang="scss" scoped>
.quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .quantity-value {
        margin-top: 10px;
    }
}
</style>
  