import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { login, logout, profile, permissions, update_profile, two_FA } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";

interface ksbTechAuth {
  isLoggedIn: boolean;
  loginLoading: boolean;
  LoggingOut: boolean;
  twoFALoading: boolean;
  updating: boolean;
  user: object | any;
  token: string;
  permissions:object | any;
  twoFA:boolean 
}

export const useAuthStore = defineStore("auth", {
  state: ():ksbTechAuth => ({
    isLoggedIn: false,
    loginLoading: false,
    LoggingOut: false,
    updating: false,
    twoFALoading: false,
    user: {},
    token: "",
    permissions:{},
    twoFA:false
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

            this.token = ''
            this.isLoggedIn = false

            this.$router.push("/authentication/fulllogin");
            this.LoggingOut = false;
          });
      } catch (error) {
        this.LoggingOut = false;
        console.log(error);
      }
    },
    async two_Factor_Auth() {
      this.twoFALoading = true
      try {
        await ksbTechApi
          .post(two_FA, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            const { notify } = useNotification();
            this.twoFALoading = false
            notify({
              title: "Login Successful",
              text: res.data.message,
              type: "success",
            });
            this.GetProfile()
            
          });
      } catch (error) {
        this.twoFALoading = false
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
              this.twoFA = res.data.data.requires_two_fa;
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
    async updateProfile(file:File) {
      this.user.avatar = file
      const formData = new FormData();
      formData.append("firstname", this.user.firstname);
      formData.append("lastname", this.user.lastname);
      formData.append("email", this.user.email);
      formData.append("phone_number", this.user.phone_number);
      formData.append("avatar", this.user.avatar);

     

     
      this.updating = true;
      try {
        await ksbTechApi
          .patch(update_profile, formData, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
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
                title: "Success",
                text: res.data.message,
                type: "success",
              });

              this.updating = false;
             
              this.GetProfile()
            }
          );
      } catch (error) {
        this.updating = false;
      }
    },
  },
  persist: true,
});
