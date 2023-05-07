<template>
  <div>
    <div class="open-search header-top-space">
      <h3>
        Travel <br />
        Experience
      </h3>
      <h4>for All</h4>
      <p>
        A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the
        rest.
      </p>
      <div class="open-search-input">
        <!-- <input v-on:keyup.enter="openSearch" v-model="message" :valid="false" errorMessage="errer" type="text"
          placeholder="Search for travel location" :disabled="!selectedLocation.latitude || !selectedLocation.longitude"
          v-e2e="'home-search-input'" /> -->
        <input v-on:keyup.enter="openSearch" ref="input" @input="onInput" v-model="searchAddress" type="text"
          errorMessage="errer" placeholder="Rechercher un emplacement de voyage" v-e2e="'home-search-input'" />

        <SfButton class="button-pos sf-button--pure color-primary" :class="{
          'is-disabled--button':
            !searchAddress
        }" @click="openSearch" :disabled="!searchAddress" v-e2e="'home-search-button'">

          <span class="sf-search-bar__icon">
            <SfIcon color="var(--c-text)" size="18px" icon="search" />
          </span>
        </SfButton>
      </div>


      <ul ref="locationListDropdown" v-if="showDropdown" class="home-page-location-list">
        <li :class="{ 'location-list-item': true, 'location-list-last-item': i === searchResults.length - 1 }"
          v-for="(result, i) in searchResults" :key="i" @click="getLocationDetails(result)">
          {{ result.description }}
        </li>
      </ul>

      <div v-if="errorMsg" class="error-msg">Veuillez remplir ce champ.</div>
    </div>

    <div class="sf-footer">
      <SfFooter class="footer">
        <!-- <p><span>By</span> <img src="../assets/images/p-b-phonepe.png" alt="" /> </p> -->
        <p>
          <span class="powered-by">Powered by</span>
          <img src="../assets/images/beckn-logo.png" alt="" />
        </p>
      </SfFooter>
    </div>
  </div>
</template>
<script>
import { SfButton, SfImage, SfIcon } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { SfFooter } from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';

export default {
  components: {
    SfButton,
    SfIcon,
    SfFooter,
    SfImage
  },

  data() {
    return {
      searchAddress: '',
      searchResults: [],
      service: null,
      showDropdown: false,
      geocodeService: null
    }

  },

  created() {
    if (process.client) {
      this.service = new window.google.maps.places.AutocompleteService();
      this.geocodeService = new window.google.maps.Geocoder();
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(position => {
      //     const { latitude, longitude } = position.coords;
      //     const latLng = new window.google.maps.LatLng(latitude, longitude);
      //     this.geocodeService.geocode({ location: latLng }, (results, status) => {
      //       if (status === 'OK' && results[0]) {
      //         localStorage.setItem('selectedLocation', results[0].formatted_address)
      //         this.searchAddress = results[0].formatted_address;
      //       }
      //     });
      //   });
      // }
    }
  },


  methods: {
    onInput() {
      if (this.searchAddress.length > 0) {
        this.service.getPlacePredictions(
          { input: this.searchAddress, types: ['geocode'], },
          (predictions, status) => {
            if (status === 'OK') {
              this.showDropdown = true;
              this.searchResults = predictions;
            } else {
              this.showDropdown = false;
              this.searchResults = [];
            }
          }
        );
      } else {
        this.showDropdown = false;
        this.searchResults = [];
      }
    },

    getLocationDetails(selectedLocation) {
      const { updateLocation } = useUiState();
      localStorage.setItem('selectedLocation', selectedLocation.description)
      this.searchAddress = selectedLocation.description;
      this.geocodeService
        .geocode({ placeId: selectedLocation.place_id })
        .then((response) => {
          updateLocation({
            latitude: response.results[0].geometry.location.lat(),
            longitude: response.results[0].geometry.location.lng(),
            address: selectedLocation.description
          });


          this.showDropdown = false;
          // eslint-disable-next-line no-alert
        })
        .catch((err) => alert(err));
    },

    handleClickOutside(event) {
      // Check if the click event occurred outside of the dropdown
      if (this.$refs.locationListDropdown && !this.$refs.locationListDropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    }
  },

  mounted() {
    // Add a click event listener to the document object
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  setup(_, context) {

    const message = ref('');
    const errorMsg = ref(false);

    const openSearch = () => {
      console.log('context in the file', localStorage.getItem('selectedLocation'))
      if (localStorage.getItem('selectedLocation')) {
        if (errorMsg.value) errorMsg.value = false;
        context.root.$router.push({
          name: 'Search',
          params: {
            searchKey: localStorage.getItem('selectedLocation')
          }
        });
      } else {
        errorMsg.value = true;
      }
    };

    return {
      // selectedLocation,
      message,
      errorMsg,
      openSearch
    };
  }
};
</script>

<style lang="scss" scoped>
.open-search {
  @media (min-width: 560px) {
    padding-top: 40px;
    width: 50%;
    margin: auto;
  }

  padding: 40px 20px;

  h3 {
    font-size: 40px;
    font-weight: 700;
    color: rgba(100, 169, 194, 1);

    line-height: 45px;
  }

  h4 {
    font-size: 27px;
    font-weight: 700;
    line-height: 30px;
    color: rgba(235, 242, 245, 1);
  }

  p {
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    color: #7c7c7c;
    margin-bottom: 30px;
    color: rgba(235, 242, 245, 1);
  }

  .open-search-input {
    border-radius: 7px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    margin-bottom: 8px;
    position: relative;

    &.disable {
      input {
        border: 1px solid #fff;
      }

      button {
        background: #bfbfbf;

        .sf-icon {
          --icon-color: #fff !important;
        }
      }
    }

    input {
      box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      border: 1px solid transparent;
      padding: 22px 10px;
      width: calc(100% - 22px);
      font-size: 15px;
      font-weight: 700;

      &::placeholder {
        font-size: 14px;
        line-height: 17px;
        color: #dbdbdc;
      }

      &:focus {
        border: 1px solid #387f9a !important;
      }
    }

    button {
      position: absolute;
      padding: 17px;
      height: 63px;
      top: 0;
      // background: #387F9A;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      right: 0;

      .sf-icon {
        --icon-color: #fff !important;
      }
    }

    // .search-placeholder {
    //   padding-left: 85px;
    // }
  }

  .error-msg {
    font-size: 14px;
    color: #d12727;
  }
}

.sf-footer {
  z-index: 1;
  text-align: center;
  background: transparent !important;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 0;

  p {
    margin: 0;

    span {
      font-size: 17px;
      position: relative;
      color: #fbfcff;
      top: -6px;


      &.powered-by {
        font-size: 10px;
        top: -1px !important;

      }
    }
  }
}

.dropdown-button {
  position: absolute;
  border-right: 1px solid #d9d9d9;
  height: 100%;
  padding: 10px;
  width: 75px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #387f9a;
  box-sizing: border-box;
  font-weight: 700;
  cursor: pointer;
}

.home-page-location-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid white;
  background-color: white;
  padding: 0;
  margin: 0;
  list-style: none;
}

.location-list-item {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.location-list-last-item {
  border-bottom: none;
}
</style>
