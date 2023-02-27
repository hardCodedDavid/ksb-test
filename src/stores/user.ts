import { defineStore } from "pinia";
import ksbTechApi from "../../axios";
import { user, admin } from "../../apiRoute";
import { useAuthStore } from "../stores/auth";
import { useCountryStore } from "../stores/country";
import { useNotification } from "@kyvg/vue3-notification";

interface Admin {
  firstname: string,
  lastname: string,
  email: string,
  phone_number: string,
  avatar: string,
  id: string,
  blocked_at:boolean
}
interface User {
  firstname: string,
  lastname: string,
  email: string,
  phone_number: string,
  avatar: string,
  wallet_balance: string,
  id: string,
  username:string
}

// interface AdminDetails {
//   firstname: string,
//   lastname: string,
//   email: string,
//   country_name: string,
// }

interface State {
  user: User[]
  admin: Admin[],
  fund: any,
  adminDetails: any,
  id: string,
  loading: boolean,
  dialog: boolean,
  dialog2: boolean,
  single_admin:any
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    user: [] as User[],
    admin: [] as Admin[],
    loading: false,
    dialog: false,
    dialog2: false,
    fund: {
      type: "",
      amount: "",
    },
    adminDetails: {
      firstname: "",
      lastname: "",
      email: "",
      country_name: "",
    },
    id: '',
    single_admin:""
  }),
  getters: {
    filterUserById: (state) => (id: string) =>
      state.user.filter((selectedUser) => {
        return selectedUser['id'] == id;
      }),
    country_id() {
      const store = useCountryStore();
      return store.countries.filter((country) => {
        if (country["name"] === this.adminDetails.country_name) {
          return country;
        }
      });
    },
   toggleActivationText: (state) => !state.single_admin?.blocked_at ? 'block' : 'restore access' 
  },
  actions: {
    updateAdmin(){
       return this.adminDetails = {...this.admin.filter((user) => user['id'] == this.id)}
    },

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
                title: "Successful",
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
    async getAdmin() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(admin, {
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
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.admin = res.data.data.admins.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleAdmin(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.dialog2 = true
      this.loading = true
      try {
        await ksbTechApi
          .get(admin + '/' + id, {
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
                title: "Successful",
                text: res.data.message,
                type: "success",
              });
              this.single_admin = res.data.data.admin;
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
                title: "Successful",
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
                title: "Successful",
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
                title: "Success",
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
    async CreateAdmin() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("country_id", this.country_id[0].id);
      formData.append("firstname", this.adminDetails.firstname);
      formData.append("lastname", this.adminDetails.lastname);
      formData.append("email", this.adminDetails.email);

      try {
        await ksbTechApi
          .post(admin, formData, {
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
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.dialog = false
              this.getAdmin();

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
    async updateAdminDetails(id:string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      const formData = new FormData();
      formData.append("country_id", this.country_id[0].id);
      formData.append("firstname", this.adminDetails.firstname);
      formData.append("lastname", this.adminDetails.lastname);
      formData.append("email", this.adminDetails.email);
      formData.append('_method', 'PATCH');

      try {
        await ksbTechApi
          .post(admin + '/' + id, formData, {
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
                title: "Success",
                text: res.data.message,
                type: "success",
              });
              this.dialog = false
              this.getAdmin();

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

    async deleteAdmin(id: string) {
      // confirm()
      if (confirm("Are you sure you want to delete this admin user?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .delete(admin + "/" + id, {
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
                  title: "Success",
                  text: 'Admin deleted successfully',
                  type: "success",
                });
                this.getAdmin()
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
    async restoreAdmin(id: string) {
      // confirm()
      if (confirm("Are you sure you want to restore access to this admin?")) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(admin + "/" + id + '/restore', "", {
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
                  text: res.data.message,
                  type: "success",
                });
                this.getAdmin()
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
    async blockAdmin(id: string) {
      // confirm()
      if (confirm(`Are you sure you want to ${this.toggleActivationText} this admin ?`)) {
        const { notify } = useNotification();
        const store = useAuthStore();
        try {
          await ksbTechApi
            .patch(admin + "/" + id + '/block', "", {
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
                  text: res.data.message,
                  type: "success",
                });
                this.getAdmin()
                this.dialog2 = false
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
  },
});
