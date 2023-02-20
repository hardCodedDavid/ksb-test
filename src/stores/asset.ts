import { defineStore } from 'pinia';
import ksbTechApi from "../../axios";
import { asset } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";


interface Data {
    id: string,
    account_name: string,
    amount: string,
    created_at: string,
    status: string,
    trade_type: string,
}


interface State {
    loading: boolean,
    dialog: boolean,
    all_transactions: {
        data: Data
    },
    single_transactions:any
}


export const useAssetStore = defineStore('asset', {
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
                trade_type: ""
            }
        },
        single_transactions:[]
    }),
    getters: {
        allTransactions: (state) => state.all_transactions.data
    },
    actions: {
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
                                title: "Login Successful",
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
        async getSingleAssetTransactions(id:string) {
            const store = useAuthStore();
            const { notify } = useNotification();
            this.loading = true;
            try {
                await ksbTechApi
                    .get(asset + '/' + id, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${store.token}`,
                        },
                    })
                    .then(
                        (res: {
                            data: {
                                message: string;
                                data: { asset_transaction:  Data  };
                            };
                        }) => {
                            this.loading = false;
                            this.dialog = true
                            notify({
                                title: "Login Successful",
                                text: res.data.message,
                                type: "success",
                            });
                            this.single_transactions = res.data.data.asset_transaction;
                        }
                    );
            } catch (error) {
                this.loading = false;
            }
        },
        async approveRequest(id: string) {
            const store = useAuthStore();
            const { notify } = useNotification();
            this.loading = true;


            var formdata = new FormData();
            formdata.append("complete_approval", "1");

            formdata.append("_method", "PATCH");

            try {
              await ksbTechApi
                .post(asset + '/' + id + '/approve',formdata , {
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
                    this.getAllAssetTransactions()
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
          async declineRequest(id: string) {
            const store = useAuthStore();
            const { notify } = useNotification();
            this.loading = true;

            var formdata = new FormData();
          

            formdata.append("_method", "PATCH");

            try {
              await ksbTechApi
                .post(asset + '/' + id + '/decline', formdata, {
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
                    this.getAllAssetTransactions()
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
