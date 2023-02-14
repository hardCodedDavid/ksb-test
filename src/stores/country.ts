import { defineStore } from "pinia";
import { country } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import ksbTechApi from "../../axios";
export const useCountryStore = defineStore({
  id: "country",
  state: () => ({
    country: [],
    currencies: [],
  }),
  getters: {
    countryNames: (state) => state.country.map((country) => country['name']),
    countries: (state) => state.country,
  },
  actions: {
    async getCountries() {
      try {
        await ksbTechApi
          .get(country  + '?do_not_paginate=' + 1, {
            headers: {
              Accept: "application/json",
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.country = res.data.data.countries;
            }
          );
      } catch (error) {

      }
    },
    async getCurrency() {
      try {
        await ksbTechApi
          .get('/currencies' + '?do_not_paginate=' + 1, {
            headers: {
              Accept: "application/json",
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.currencies = res.data.data.currencies.data;
            }
          );
      } catch (error) {

      }
    },
    async getProducts() {
      try {
        await ksbTechApi
          .get('/giftcard-products' + '?do_not_paginate=' + 1, {
            headers: {
              Accept: "application/json",
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.currencies = res.data.data.currencies.data;
            }
          );
      } catch (error) {

      }
    },
  },
});
//  + '?do_not_paginate=1'