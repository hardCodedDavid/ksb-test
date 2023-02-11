import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { user } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "@kyvg/vue3-notification";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    loading: false,
    fund: {
      type: "",
      amount: "",
    },
  }),
  getters: {
    filterUserById: (state) => (id: string) =>
      state.user.filter((selectedUser: { id: string }) => {
        return selectedUser.id == id;
      }),
  },
  actions: {
    async getUsers() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(user, {
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
              this.loading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.user = res.data.data.users.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async blockUsers(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .patch(user + "/" + id + "/block", "", {
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
              this.loading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.getUsers();
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async restoreUsers(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .post(user + id + "/block", "", {
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
              this.loading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.getUsers();
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async financeUsers(
      id: string,
      financeTrans: { type: string; amount: string }
    ) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("amount", financeTrans.amount);

      try {
        await ksbTechApi
          .post(
            user +
              "/" +
              id +
              "/finance/" +
              financeTrans.type.toLocaleLowerCase(),
            formData,
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
              this.loading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.getUsers();
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
