import { defineStore } from 'pinia';

import ksbTechApi from "../../axios";
import { alert } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";

interface Payload {
    id:string,
    title:string,
    body:string,
    target_user:string,
    dispatched_at:string,
    channels:[]
}

export const useAlertStore = defineStore('alert', {
    state: () => ({
        loading:false,
        dialog:false,
        alerts:[],
        alert:{
            title:"",
            body:"",
            target_user:"",
            dispatched_at:"",
            channels:[]
        }
    }),
    getters: {
        
    },
    actions: {
        async getAlerts() {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true
            try {
              await ksbTechApi
                .get(alert, {
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
                    this.alerts = res.data.data.alerts.data
                    this.loading = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
        
        async createAlert(alerts:Payload) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            var formData = new FormData();
            formData.append("title", alerts.title);
            formData.append("body", alerts.body);
            formData.append("target_user", alerts.target_user.toLowerCase());
            formData.append("dispatch_datetime", alerts.dispatched_at + ' ' + '5:00');
            // formData.append("target_user", alert.target_user);

            const emails = alerts.channels

            for (let i = 0; i < emails.length; i++) {
                formData.append('channels[]', emails[i]);
              }

            // formData.append("name", role.name);

            try {
              await ksbTechApi
                .post(alert, formData, {
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
                    this.getAlerts()
                    this.loading = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
        async updateAlert(alerts:Payload) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            var formData = new FormData();
            formData.append("title", alerts.title);
            !alerts.body ? null :  formData.append("body", alerts.body);
            formData.append("target_user", alerts.target_user);
            formData.append("dispatch_datetime", alerts.dispatched_at);

            formData.append('_method', 'PATCH');
            // for (let i = 0; i < this.role.permission_id.length; i++) {
            //     formData.append('permissions[]', this.role.permission_id[i]);
            //   }

            // formData.append("name", role.name);

            try {
              await ksbTechApi
                .post(alert + '/' + alerts.id ,formData, {
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
                    this.getAlerts()
                    this.loading = false
                    this.dialog = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
        async deleteAlert(
            id:string,
           ) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            try {
              await ksbTechApi
                .delete(alert + '/' + id, {
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
                    this.getAlerts()
                    this.loading = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
        async restoreAlert(
            id:string,
           ) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            try {
              await ksbTechApi
                .patch(alert + '/' + id + '/restore', "" , {
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
                    this.getAlerts()
                    this.loading = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
        async dispatchAlert(
            id:string,
           ) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            try {
              await ksbTechApi
                .post(alert + '/' + id + '/dispatch', "", {
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
                    this.getAlerts()
                    this.loading = false
                  }
                );
            } catch (error: any) {
              this.loading = false
              notify({
                title: "An Error Occurred",
                text: error.response.data.message,
                type: "error",
              });
            }
          },
    },
});
