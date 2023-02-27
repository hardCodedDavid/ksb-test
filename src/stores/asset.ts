import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { asset, assets } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";

interface Data {
  id: string;
  account_name: string;
  amount: string;
  created_at: string;
  status: string;
  trade_type: string;
}

interface Asset {
  name: string;
  code: string;
  icon: string | Blob;
  buy_rate: string;
  sell_rate: string;
  id:string
}

interface State {
  loading: boolean;
  dialog: boolean;
  all_transactions: {
    data: Data;
  };
  single_transactions: any;
  asset: Asset;
  assets: [];
}

export const useAssetStore = defineStore("asset", {
  state: (): State => ({
    loading: false,
    dialog: false,
    all_transactions: {
      data: {
        id: "",
        account_name: "",
        amount: "",
        created_at: "",
        status: "",
        trade_type: "",
      },
    },
    single_transactions: [],
    asset: {
      name: "",
      code: "",
      icon: '',
      buy_rate: "",
      sell_rate: "",
      id:''
    },
    assets: [],
  }),
  getters: {
    allTransactions: (state) => state.all_transactions.data,
  },
  actions: {
    // ASSETS TRANSACTION
    async getAllAssetTransactions() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionsByUserId(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + '?filter[user_id]=' + id, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
   
    async getSingleAssetTransactions(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + "/" + id, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transaction: Data };
              };
            }) => {
              this.loading = false;
              this.dialog = true;
              this.single_transactions = res.data.data.asset_transaction;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },

    async approveAssetTransactions(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      var formData = new FormData();
      formData.append("_method", "PATCH");
      formData.append("complete_approval", "1");
      try {
        await ksbTechApi
          .post(asset + "/" + id + "/approve", formData, {
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
                title: "Approval Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllAssetTransactions();
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
  
    async declineAssetTransactions(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      var formData = new FormData();
      formData.append("_method", "PATCH");
      if (confirm("Are you sure you want to decline this asset item ?")) {
      try {
        await ksbTechApi
          .post(asset + "/" + id + '/decline', formData, {
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
                title: "Decline Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllAssetTransactions();
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
    }
  },

  
    // ASSETS
    async getAllAsset() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(assets, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { assets: any };
              };
            }) => {
              this.loading = false;
             
              this.assets = res.data.data.assets.data;
              
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async createAssets(asset_t:Asset) {
      const store = useAuthStore();
      var formData = new FormData();
  
      this.loading = true;

      formData.append("name", asset_t.name);
      formData.append("code", asset_t.code);
      formData.append("icon", asset_t.icon);
      formData.append("buy_rate", asset_t.buy_rate);
      formData.append("sell_rate", asset_t.sell_rate);
  
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(assets, formData, {
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
              this.getAllAsset();
              this.dialog = false
            }
          );
      } catch (error:any) {
        this.loading = false;
        
        const { notify } = useNotification();
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async updateAssets(asset_t:Asset) {
      const store = useAuthStore();
      var formData = new FormData();
  
      this.loading = true;

      formData.append("name", asset_t.name);
      formData.append("code", asset_t.code);
      formData.append("icon", asset_t.icon);
      formData.append("buy_rate", asset_t.buy_rate);
      formData.append("sell_rate", asset_t.sell_rate);
      formData.append("_method", "PATCH");

      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(assets + '/' + asset_t.id, formData, {
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
              this.getAllAsset();
              this.dialog = false
            }
          );
      } catch (error:any) {
        this.loading = false;
        
        const { notify } = useNotification();
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    
    async restoreAsset(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      try {
        await ksbTechApi
          .patch(assets + "/" + id + "/restore", "", {
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
              this.getAllAsset();
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
    async deleteAsset(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      try {
        await ksbTechApi
          .delete(assets + "/" + id, {
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
              this.getAllAsset();
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
