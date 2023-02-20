import { defineStore } from "pinia";
import { country, countryMgt } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import ksbTechApi from "../../axios";
import { useAuthStore } from "./auth";

export const useCountryStore = defineStore({
  id: "country",
  state: () => ({
    country: [],
    countryMgt: [],
    currencies: [],
    loading:false
  }),
  getters: {
    countryNames: (state) => state.country.map((country) => country['name']),
    countries: (state) => state.country,
  },
  actions: {
    async getCountries() {
      try {
        await ksbTechApi
          .get(country  + '?filter[giftcard_activated]=' + 1  , {
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
    async getCountryMgt() {
      const store = useAuthStore();
      this.loading= true
      try {
        await ksbTechApi
          .get(countryMgt ,{
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.countryMgt = res.data.data.countries.data;
              this.loading= false
            }
          );
      } catch (error) {
        this.loading= false
      }
    },
    async registrationActivation(id: string) {
      const store = useAuthStore();
      this.loading= true
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/registration', ""  ,{
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getCountryMgt()
              this.loading= false
            }
          );
      } catch (error) {
        this.loading= false
      }
    },
    async giftcardActivation(id: string) {
      const store = useAuthStore();
      this.loading= true
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/giftcard', ""  ,{
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getCountryMgt()
              this.loading= false
            }
          );
      } catch (error) {
        this.loading= false
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
          .get('/giftcard-categories' + '?include=countries' , {
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