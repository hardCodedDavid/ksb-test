import { defineStore } from "pinia";

import ksbTechApi from "../../axios";
import { withdrawals } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "@kyvg/vue3-notification";


interface Data {
  id: string,
  amount: string,
  created_at: string,
  status: string,
}

    


interface State {
  withdrawal: any,
  loading: boolean,
  singleWithdrawal: any
}


export const useWithdrawalsStore = defineStore("withdrawals", {
  state: (): State => ({
    withdrawal: {
      
    },
    loading: false,
    singleWithdrawal: {}
  }),
  getters: {
    withdrawals: (state) => state.withdrawal.data
  },
  actions: {
    async getAllWithDrawals(status:string, page_no:number) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(withdrawals + '?include=' + 'user' + '&page=' + page_no + '&filter[status]=' + status , {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transactions: Data };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.withdrawal = res.data.data.wallet_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async filterWithDrawalsByDateCreated(data_created:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(withdrawals + '?sort=' + data_created, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transactions: Data };
              };
            }) => {
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.withdrawal = res.data.data.wallet_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleWithDrawals(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();

      try {
        await ksbTechApi
          .get(withdrawals + '/' + id, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { wallet_transaction: object };
              };
            }) => {

              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.singleWithdrawal = res.data.data.wallet_transaction;
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
    async approveRequest(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      var formData = new FormData()

      formData.append('_method', 'PATCH');
      try {
        await ksbTechApi
          .post(withdrawals + '/' + id + '/approve', formData, {
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
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals(1)
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
      try {
        await ksbTechApi
          .patch(withdrawals + '/' + id + '/decline', "", {
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
              this.loading = false;
              notify({
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals(1)
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


// https://flexy-vue3-main-admin.vercel.app/ui-components/cards
// https://flexy-vue3-main-admin.vercel.app/ui-components/tabs
// https://flexy-vue3-main-admin.vercel.app/ui-components/dividers