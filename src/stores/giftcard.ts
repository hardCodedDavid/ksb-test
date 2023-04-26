import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { giftCardCategory, giftCardProducts, giftCard } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";
import { useCountryStore } from "./country";
import { useRoute } from "vue-router";

interface GiftCard {
  giftCard: {
    name: string;
    icon: File | null;
    sale_term: string;
    countries: any;
    data: string;
    admins: [];
  };
  loading: boolean;
  declining: boolean;
  approving: boolean;
  gift_categories: [];
  gift_transactions: [];
  dialog: boolean;
  dialog2: boolean;
  singleGiftCard: any;
  singleGiftCardTransaction: {
    cards: string[];
  };
  singleGiftcardUnit: number;
  relatedGiftCards: any;
  update_category: boolean;
  update_admin: boolean;
}

interface GiftCategoryPayload {
  name: string;
  icon: any;
  sale_term: string;
  countries: any;
  id?: string;
}

export const useGiftCardStore = defineStore("giftcard", {
  state: (): GiftCard => ({
    giftCard: {
      name: "",
      icon: null,
      sale_term: "",
      countries: [],
      data: "",

      admins: [],
    },
    loading: false,
    declining: false,
    approving: false,
    gift_categories: [],
    dialog: false,
    dialog2: false,
    singleGiftCard: {},
    gift_transactions: [],
    singleGiftCardTransaction: {
      cards: [],
    },
    singleGiftcardUnit: 0,
    relatedGiftCards: [],
    update_category: false,
    update_admin: false,
  }),
  getters: {
    country_id: (state) =>
      state.giftCard.countries?.map((item: any) => {
        if (item.id) {
          return item.id;
        } else return item;
      }),
    admin_id: (state) =>
      state.giftCard.admins?.map((item: any) => {
        if (item.id) {
          return item.id;
        } else return item;
      }),
  },
  actions: {
    async getAllGifCardCategories(
      page: number = 1,
      name: string = "",
      sale: string = "",
      purchase: string = ""
    ) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            giftCardCategory +
              "?include=countries" +
              "&page=" +
              page +
              "&filter[name]=" +
              name +
              "&filter[sale_activated]=" +
              sale +
              "&filter[purchase_activated]=" +
              purchase,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.gift_categories = res.data.data.giftcard_categories;
              this.loading = false;
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
    async giftCardTransactionQueries(status: string, page: number = 1) {
      const store = useAuthStore();
      const data = await ksbTechApi.get(
        giftCard +
          "?per_page=100" +
          "&include=user,giftcardProduct" +
          `&filter[status]=${status}` +
          `&page=${page}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      return data;
    },
    async getAllGiftCardTransaction(
      status: string,
      trade_type: string = "",
      page: number = 1,
      date1: string = "",
      date2: string = "",
      reference: string = " "
    ) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            giftCard +
              "?per_page=50" +
              "&include=user,giftcardProduct" +
              `&filter[status]=${status}` +
              `&filter[reference]=${reference}` +
              `&filter[trade_type]=${trade_type.toLowerCase()}` +
              `&page=${page}` +
              `&filter[creation_date]=${date1}${
                date2 !== "" ? "," + date2 : ""
              }`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${store.token}`,
              },
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.gift_transactions = res.data.data.giftcards;
              this.loading = false;
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
    async getAllGiftCardTransactionByUserId(id: string) {
      const { notify } = useNotification();
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(`${giftCard}/${id}?include=user,bank,giftcardProduct,reviewer`, {
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
              this.singleGiftCardTransaction = res.data.data.giftcard;
              this.singleGiftcardUnit = res.data.data.related_giftcards.length;
              this.relatedGiftCards = res.data.data.related_giftcards;
              this.loading = false;
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
    async approveRequest(id: string, page: number) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.approving = true;

      var formdata = new FormData();
      formdata.append("complete_approval", "1");

      // formdata.append("review_proof", fileInput.files[0], "payment-receipt.png");
      formdata.append("_method", "PATCH");

      try {
        await ksbTechApi
          .post(giftCard + "/" + id + "/approve", formdata, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.approving = false;
              this.dialog = false;
              notify({
                title: "Approved Successfully",
                text: res.data.message,
                type: "success",
              });
              this.getAllGiftCardTransactionByUserId(id);
              this.getAllGiftCardTransaction("", "", page, "", "");
            }
          );
      } catch (error: any) {
        this.approving = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async partialApproveRequest(id: string, data: any) {
      const store = useAuthStore();
      const route: any = useRoute();
      const { notify } = useNotification();
      this.approving = true;

      var formdata = new FormData();
      formdata.append("complete_approval", "0");
      formdata.append("review_rate", data.review_rate);
      formdata.append("review_note", data.review_note);
      formdata.append("review_proof", data.review_proof);
      formdata.append("_method", "PATCH");

      try {
        await ksbTechApi
          .post(giftCard + "/" + id + "/approve", formdata, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.approving = false;
              this.dialog2 = false;
              this.getAllGiftCardTransactionByUserId(id);
              this.getAllGiftCardTransaction("", "", 1, "", "");
              notify({
                title: "Approved Successfully",
                text: res.data.message,
                type: "success",
              });
            }
          );
      } catch (error: any) {
        this.approving = false;
        this.dialog = false;
        this.dialog2 = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async declineRequest(
      id: string,
      note: string,
      reproof: File,
      page: number
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.declining = true;

      var formdata = new FormData();
      formdata.append("review_note", note);
      formdata.append("_method", "PATCH");
      formdata.append("review_proof", reproof);
      try {
        await ksbTechApi
          .post(giftCard + "/" + id + "/decline", formdata, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.declining = false;
              this.dialog = false;
              this.dialog2 = false;

              notify({
                title: "Declined Successfully",
                text: res.data.message,
                type: "success",
              });
              this.getAllGiftCardTransactionByUserId(id);
              this.getAllGiftCardTransaction("", "", page, "", "");
            }
          );
      } catch (error: any) {
        this.declining = false;
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
          .get(giftCardCategory + "/" + id + "?include=countries,admins", {
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
              this.giftCard = res.data.data.giftcard_category;
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
                  text: "Item deleted successfully",
                  type: "success",
                });
                this.getAllGifCardCategories();
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
            .patch(giftCardCategory + "/" + id + "/restore", "", {
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
                  text: "Item restored successfully",
                  type: "success",
                });
                this.getAllGifCardCategories();
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

      const { notify } = useNotification();
      const store = useAuthStore();
      try {
        await ksbTechApi
          .patch(giftCardCategory + "/" + id + "/sale-activation", "", {
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
                text: "Item restored successfully",
                type: "success",
              });
              this.getAllGifCardCategories();
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
    async purchaseActivationGifCardCategories(id: string) {
      // confirm()

      const { notify } = useNotification();
      const store = useAuthStore();
      try {
        await ksbTechApi
          .patch(giftCardCategory + "/" + id + "/purchase-activation", "", {
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
                text: "Item restored successfully",
                type: "success",
              });
              this.getAllGifCardCategories();
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
    async createGiftCardCategory(payload: GiftCategoryPayload) {
      const store = useAuthStore();
      const { notify } = useNotification();

      // const country_id = {...this.country_id};
      // console.log(country_id)
      let file = payload.icon;

      var formData = new FormData();
      formData.append("name", payload.name);
      formData.append("icon", file);
      formData.append("sale_term", payload.sale_term);

      const ids = this.country_id;
      const admin_id = this.admin_id;
      for (let i = 0; i < ids.length; i++) {
        formData.append("countries[]", ids[i]);
      }
      for (let i = 0; i < admin_id.length; i++) {
        formData.append("admins[]", admin_id[i]);
      }

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
                title: "Successful",
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
    async editGiftCardCategory(payload: GiftCategoryPayload) {
      const store = useAuthStore();
      const { notify } = useNotification();

      // const country_id = {...this.country_id};
      console.log(payload.countries);
      let file = payload.icon;
      let countries = [];

      var formData = new FormData();
      formData.append("name", payload.name);
      !file.name ? "" : formData.append("icon", file, file.name);

      !payload?.sale_term
        ? ""
        : formData.append("sale_term", payload?.sale_term);

      const ids = this.country_id;
      if (ids?.length > 0 && this.update_category) {
        for (let i = 0; i < ids.length; i++) {
          formData.append("countries[]", ids[i]);
        }
      }

      const admin_id = this.admin_id;
      if (admin_id?.length > 0 && this.update_admin) {
        for (let i = 0; i < admin_id.length; i++) {
          formData.append("admins[]", admin_id[i]);
        }
      }

      formData.append("_method", "PATCH");

      this.loading = true;
      try {
        await ksbTechApi
          .post(giftCardCategory + "/" + payload.id, formData, {
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
              this.update_admin = false;
              this.update_category = false;
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
