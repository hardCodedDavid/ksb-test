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
    country: any;
    sell_rate: Number | null;
    sell_min_amount: string;
    sell_max_amount: string;
  };
  loading: boolean;
  gift_products: GiftProductPayload;
  dialog: boolean;
  singleGiftProduct:any
}

interface GiftProductPayload {
  name: string;
  country: string;
  currency: string;
  sell_rate: string;
  sell_min_amount: string;
  sell_max_amount: string;
  id:string,
  data:any,
  
}

export const useGiftProductStore = defineStore("gift_product", {
  state: (): GiftCardProduct => ({
    giftCard: {
      name: "",
      currency: "98545e1f-434c-4592-a3e4-3402be9e3cab",
      country: [],
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
    singleGiftProduct:{}
  }),
  getters: {
  
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
        "987d0d01-97dc-41d8-8725-6316e520cae8"
      );
      formData.append("country_id", "98419dc7-b43a-4723-b7b3-e1525269b193");
      formData.append("currency_id", "9874e18a-cedd-49fa-8f71-191b040bc661");

      formData.append("name", payload.name);
      formData.append("sell_rate", payload.sell_rate);
      formData.append("sell_min_amount", payload.sell_min_amount);
      formData.append("sell_max_amount", payload.sell_max_amount);
      // formData.append("country_id", JSON.stringify(this.giftCard.country));

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
                title: "Successful",
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

    async getSingleGifCardCategories(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      try {
        await ksbTechApi
          .get(giftCardProducts + "/" + id, {
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
              this.singleGiftProduct = res.data.data.giftcard_product;
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
    async deleteGifCardProducts(id: string) {
      // confirm()
      if (confirm("Are you sure you want to delete this gift card Item?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .delete(giftCardProducts + "/" + id, {
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
                  text: 'Item deleted successfully',
                  type: "success",
                });
                this.getAllGifCardProduct()
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },
    async restoreGifCardProduct(id: string) {
      // confirm()
      if (confirm("Are you sure you want to restore this gift card Item?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(giftCardProducts + "/" + id + '/restore' , "",{
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
                  text: 'Item restored successfully',
                  type: "success",
                });
                this.getAllGifCardProduct()
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },
    async activationGifCardProduct(id: string) {
      // confirm()
      if (confirm("Are you sure you want to activation this gift card Item ?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(giftCardProducts + "/" + id + '/activation' , "",{
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
                  text: 'Item restored successfully',
                  type: "success",
                });
                this.getAllGifCardProduct()
              }
            );
        } catch (error: any) {
          notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
        }
      }
    },
  },
});
