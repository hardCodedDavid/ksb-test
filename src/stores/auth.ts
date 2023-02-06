import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { login, logout, profile, permissions } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";

interface ksbTechAuth {
  isLoggedIn: boolean;
  loginLoading: boolean;
  LoggingOut: boolean;
  user: object | any;
  token: string;
  permissions:object | any
}

export const useAuthStore = defineStore("auth", {
  state: ():ksbTechAuth => ({
    isLoggedIn: false,
    loginLoading: false,
    LoggingOut: false,
    user: {},
    token: "",
    permissions:{}
  }),
  getters: {
    userInitials: (state) => state.user
  },
  actions: {
    async ksbTechLogin(loginDetails: { email: string; password: string }) {
      const formData = new FormData();
      formData.append("email", loginDetails.email);
      formData.append("password", loginDetails.password);
      this.loginLoading = true;
      try {
        await ksbTechApi
          .post(login, formData, {
            headers: {
              Accept: "application/json",
            },
            redirect: "follow",
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
              message: string;
            }) => {
              const { notify } = useNotification();

              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });

              this.loginLoading = false;
              this.$router.push("/dashboards/analytical");
              this.isLoggedIn = true;

              this.token = res.data.data.token;
              this.user = res.data.data.admin;
            }
          );
      } catch (error) {
        this.loginLoading = false;
      }
    },
    async ksbTechLogout() {
      this.LoggingOut = true;
      try {
        await ksbTechApi
          .post(logout, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            const { notify } = useNotification();

            notify({
              title: "Login Successful",
              text: res.data.message,
              type: "success",
            });
            this.$router.push("/authentication/fulllogin");
            this.LoggingOut = false;
          });
      } catch (error) {
        this.LoggingOut = false;
        console.log(error);
      }
    },
    async GetProfile() {
      try {
        await ksbTechApi
          .get(profile, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.user = res.data.data.admin;
            }
          );
      } catch (error) {
        console.log(error);
      }
    },
    async getPermissions() {
      try {
        await ksbTechApi
          .get(permissions, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.permissions = res.data.data.admin;
            }
          );
      } catch (error) {
        console.log(error);
      }
    },
  },
  persist: true,
});
