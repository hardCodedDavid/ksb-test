import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { giftCardProducts } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";
import { useCountryStore } from "./country";

interface GiftCardProduct {
  giftCard: {
    name: string;
    currency: string;
    country: string;
    sell_rate: Number | null;
    sell_min_amount: string;
    sell_max_amount: string;
  };
  loading: boolean;
  gift_products: GiftProductPayload;
  dialog: boolean;
}

interface GiftProductPayload {
  name: string;
  country: string;
  currency: string;
  sell_rate: string;
  sell_min_amount: string;
  sell_max_amount: string;
  id:string,
  data:any
}

export const useGiftProductStore = defineStore("gift_product", {
  state: (): GiftCardProduct => ({
    giftCard: {
      name: "",
      currency: "98545e1f-434c-4592-a3e4-3402be9e3cab",
      country: "",
      sell_rate: 0,
      sell_min_amount: "",
      sell_max_amount: "",
    },
    loading: false,
    gift_products: {
      name: '',
  country: '',
  currency: '',
  sell_rate: '',
  sell_min_amount: '',
  sell_max_amount: '',
  id:'',
  data:'',
    },
    dialog: false,
  }),
  getters: {
    country_id() {
      const store = useCountryStore();
      return store.countries.filter((country) => {
        if (country["name"] === this.giftCard.country) {
          return country;
        }
      });
    },
  },
  actions: {
    async getAllGifCardProduct() {
      const { notify } = useNotification();
      const store = useAuthStore();
      try {
        await ksbTechApi
          .get(giftCardProducts, {
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
              this.gift_products = res.data.data.giftcard_products;
            }
          );
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async createGiftCardProduct(payload: GiftProductPayload) {
      const store = useAuthStore();
      const { notify } = useNotification();

      //   const country_id = this.country_id;

      var formData = new FormData();
      formData.append(
        "giftcard_category_id",
        "98547c51-047d-409b-9da6-74bd1830204b"
      );
      formData.append("country_id", "98494f88-b0ae-4f42-afe5-2710813f8eb7");
      formData.append("currency_id", "98545e1f-459d-4abf-8350-0d414abef12a");
      formData.append("name", payload.name);
      formData.append("sell_rate", payload.sell_rate);
      formData.append("sell_min_amount", payload.sell_min_amount);
      formData.append("sell_max_amount", payload.sell_max_amount);
      // formData.append("countries[]", this.country_id[0].id);

      this.loading = true;
      try {
        await ksbTechApi
          .post(giftCardProducts, formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.dialog = false;
              this.getAllGifCardProduct();
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
  },
});
