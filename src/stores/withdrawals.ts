import { defineStore } from "pinia";

import ksbTechApi from "../../axios";
import { withdrawals } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "@kyvg/vue3-notification";

interface WITHDRAWAL {
    data:Array<object>
}

export const useWithdrawalsStore = defineStore("withdrawals", {
  state: () => ({
    withdrawal: {} as WITHDRAWAL,
    loading: false,
    singleWithdrawal:{}
  }),
  getters: {
    withdrawals:(state) => state.withdrawal.data
  },
  actions: {
    async getAllWithDrawals() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(withdrawals, {
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
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.withdrawal = res.data.data.withdrawal_requests;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleWithDrawals(id:string) {
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
                data: { withdrawal_requests: object };
              };
            }) => {
            
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.singleWithdrawal = res.data.data.withdrawal_request;
            }
          );
      } catch (error:any) {
        this.loading = false;
        notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
      }
    },
    async approveRequest(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .post(withdrawals + '/' + id + '/approve', "",{
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
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals()
            }
          );
      } catch (error:any) {
        this.loading = false;
        notify({
            title: "An Error Occurred",
            text: error.response.data.message,
            type: "error",
          });
      }
    },
    async declineRequest(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .post(withdrawals + '/' + id + '/decline', "",{
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
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.getAllWithDrawals()
            }
          );
      } catch (error:any) {
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
