import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import {
  login,
  logout,
  profile,
  permissions,
  update_profile,
  two_FA,
  verify_two_FA,
  resend_two_fa,
  update_password,
  requestCode,
  verifyCodeAndEmail,
  resetPassword,
} from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";

interface ksbTechAuth {
  isLoggedIn: boolean;
  loginLoading: boolean;
  LoggingOut: boolean;
  twoFALoading: boolean;
  verifyTwoFALoading: boolean;
  updating: boolean;
  user: object | any;
  token: string;
  permissions: object | any;
  twoFA: boolean;
  email:string
}

export const useAuthStore = defineStore("auth", {
  state: (): ksbTechAuth => ({
    isLoggedIn: false,
    loginLoading: false,
    LoggingOut: false,
    updating: false,
    twoFALoading: false,
    verifyTwoFALoading: false,
    user: {},
    token: "",
    permissions: {},
    twoFA: false,
    email:""
  }),
  getters: {
    userInitials: (state) => state.user,
  },
  actions: {
    async ksbTechLogin(loginDetails: { email: string; password: string }) {
      const formData = new FormData();
      formData.append("email", loginDetails.email);
      formData.append("password", loginDetails.password);
      this.loginLoading = true;
      const { notify } = useNotification();
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
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechRequestCode(data: string) {
      const formData = new FormData();
      formData.append("email", data);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(requestCode, formData, {
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
              this.$router.push("/authentication/reset-password");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechVerifyCode(code: any) {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("email", this.email);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(verifyCodeAndEmail, formData, {
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
            
              this.loginLoading = false;
              this.$router.push("/authentication/reset-password");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechResetPassword(data: {
      email: string;
      code: any;
      password: any;
      password_confirmation: any;
    }) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("code", data.code);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      this.loginLoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(requestCode, formData, {
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
              this.$router.push("/authentication/fulllogin");
            }
          );
      } catch (error: any) {
        this.loginLoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async ksbTechLogout() {
      this.LoggingOut = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(logout, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            notify({
              title: "Login Successful",
              text: res.data.message,
              type: "success",
            });

            this.token = "";
            this.isLoggedIn = false;

            this.$router.push("/authentication/fulllogin");
            this.LoggingOut = false;
            console.log(res, "grgrg");
          })
          .catch((error: any) => {
            notify({
              title: "Login Successful",
              text: error.response.message,
              type: "error",
            });
          });
      } catch (error: any) {
        this.LoggingOut = false;
        console.log(error.response);
      }
    },
    async two_Factor_Auth() {
      this.twoFALoading = true;
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(two_FA, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            this.twoFALoading = false;
            notify({
              title: "Login Successful",
              text: res.data.message,
              type: "success",
            });
            this.GetProfile();
          });
      } catch (error: any) {
        this.twoFALoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async verify_two_Factor_Auth(code: string) {
      this.twoFALoading = true;

      const data = new FormData();

      data.append("code", code);

      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(verify_two_FA, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then(
            (res: { data: { data: { token: string }; message: string } }) => {
              this.$router.push("/dashboards/analytical");
              this.twoFALoading = false;
              notify({
                title: "Login Successful",
                text: res.data.message,
                type: "success",
              });
              this.token = res.data.data.token;
            }
          );
      } catch (error: any) {
        this.twoFALoading = false;
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async resend_two_Factor_Auth() {
      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(resend_two_fa, "", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res: { data: { message: string } }) => {
            notify({
              title: "Success",
              text: res.data.message,
              type: "success",
            });
          });
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
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
      const { notify } = useNotification();
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
              this.permissions = res.data.data.permissions;
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
    async updateProfile(file: File) {
      this.user.avatar = file;
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

              this.GetProfile();
            }
          );
      } catch (error) {
        this.updating = false;
      }
    },
    async updatePassword(passwordDetails: object) {
      const { notify } = useNotification();
      this.updating = true;
      try {
        await ksbTechApi
          .post(update_password, passwordDetails, {
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
              notify({
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.updating = false;
            }
          );
      } catch (error: any) {
        notify({
          title: "An Error Occurred",
          text: error.response.data.message,
          type: "error",
        });
        this.updating = false;
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
