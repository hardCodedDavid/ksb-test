import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { giftCardCategory, giftCardProducts } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";
import { useCountryStore } from "./country";

interface GiftCard {
  giftCard: {
    name: string;
    icon: File | null;
    sale_term: string;
    country: string;
    currency: string;
    data: string;
  };
  loading: boolean;
  gift_categories: Array<object> | [];
  dialog: boolean;
  singleGiftCard: any;
}

interface GiftCategoryPayload {
  name: string;
  icon: any;
  sale_term: string;
  country: string;
}

export const useGiftCardStore = defineStore("giftcard", {
  state: (): GiftCard => ({
    giftCard: {
      name: "",
      icon: null,
      sale_term: "",
      country: "",
      currency: "",
      data: ""
    },
    loading: false,
    gift_categories: [],
    dialog: false,
    singleGiftCard: {},
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
    async getAllGifCardCategories() {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true
      try {
        await ksbTechApi
          .get(giftCardCategory, {
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
              this.gift_categories = res.data.data.giftcard_categories;
              this.loading = false
            }
          );
      } catch (error: any) {
        this.loading = false
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
          .get(giftCardCategory + "/" + id, {
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
              this.singleGiftCard = res.data.data.giftcard_category;
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
    async deleteGifCardCategories(id: string) {
      // confirm()
      if (confirm("Are you sure you want to delete this gift card Item?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .delete(giftCardCategory + "/" + id, {
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
                this.getAllGifCardCategories()
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
    async restoreGifCardCategories(id: string) {
      // confirm()
      if (confirm("Are you sure you want to restore this gift card Item?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(giftCardCategory + "/" + id + '/restore' , "",{
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
                this.getAllGifCardCategories()
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
    async activationGifCardCategories(id: string) {
      // confirm()
      if (confirm("Are you sure you want to activation this gift card Item ?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(giftCardCategory + "/" + id + '/activation' , "",{
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
                this.getAllGifCardCategories()
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
    async createGiftCardCategory(payload: GiftCategoryPayload) {
      const store = useAuthStore();
      const { notify } = useNotification();

      const country_id = {...this.country_id};
      console.log(country_id)
      let file = payload.icon;

      var formData = new FormData();
      formData.append("name", payload.name);
      formData.append("icon", file, file.name);
      formData.append("sale_term", payload.sale_term);
      // formData.append("countries[]", country_id.id);

      this.loading = true;
      try {
        await ksbTechApi
          .post(giftCardCategory, formData, {
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
              this.getAllGifCardCategories();
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
