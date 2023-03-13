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
    giftCategories: [],
    dialog:false,
    exchange_rate_to_ngn:"",
    loading: false
  }),
  getters: {
    countryNames: (state) => state.country.map((country) => country['name']),
    countries: (state) => state.country,
    giftCardCategories: state => state.giftCategories.map((items) => {
      return {
        id: items['id'],
        name: items['name'],
      }
    })
  },
  actions: {
    async getCountries() {
      try {
        await ksbTechApi
          .get(country + '?filter[giftcard_activated]=' + 1, {
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
              this.country = res.data.data.countries.data;
            }
          );
      } catch (error) {

      }
    },
    async getCountryMgt(page_no:number) {
      const store = useAuthStore();
      this.loading = true
      try {
        await ksbTechApi
          .get(countryMgt + '?per_page=' +  100 + '&page=' + page_no, {
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
              this.loading = false
            }
          );
      } catch (error) {
        this.loading = false
      }
    },
    async registrationActivation(id: string) {
      const store = useAuthStore();
      this.loading = true
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/registration', "", {
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
              this.getCountryMgt(1)
              this.loading = false
            }
          );
      } catch (error) {
        this.loading = false
      }
    },
    async giftcardActivation(id: string) {
      
      const store = useAuthStore();
      this.loading = true
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/giftcard', "", {
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
              this.getCountryMgt(1)
              this.loading = false
            }
          );
      } catch (error) {
        this.loading = false
      }
    },
    
    async getCurrency(name:string = '') {
      try {
        this.loading = true
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
              this.currencies = res.data.data.currencies;
              this.loading = false
            }
          );
      } catch (error) {

        this.loading = false
      }
    },
    async updateCurrency(id:string) {
      try {
        const { notify } = useNotification();
        const store = useAuthStore();
        this.loading = true
        var formData = new FormData()

        formData.append("exchange_rate_to_ngn", this.exchange_rate_to_ngn);
        formData.append("_method", "PATCH");

        await ksbTechApi
          .post('/admin/currencies' + '/' + id, formData ,{
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
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.loading =false
              this.dialog =false
            }
          );
      } catch (error) {
        this.loading =false
      }
    },
    async getProducts() {
      try {
        await ksbTechApi
          .get('/giftcard-categories' + '?include=countries', {
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
              this.giftCategories = res.data.data.giftcard_categories.data;
            }
          );
      } catch (error) {

      }
    },
  },
});
//  + '?do_not_paginate=1'