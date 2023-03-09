import { defineStore } from 'pinia';

import ksbTechApi from "../../axios";
import { permission, roles } from "../../apiRoute";
import { useNotification } from "@kyvg/vue3-notification";
import { useAuthStore } from "./auth";

export const useRolesPermissionsStore = defineStore('roles-permissions', {
    state: () => ({
        loading:false,
        dialog:false,
        roles:[],
        permissions:[],
        role:{
            name:"",
            description:"",
            permission_id:[]
        }
    }),
    getters: {
        
    },
    actions: {
        async getAllRoles() {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true
            try {
              await ksbTechApi
                .get(roles, {
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
                    this.roles = res.data.data.roles.data;
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
        async getAllPermissions() {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true
            try {
              await ksbTechApi
                .get(permission + '?do_not_paginate=' + 1 , {
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
                    this.permissions = res.data.data.permissions;
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
        async createRole(role:{
            name:string,
            description:string,
            permission_id:string
        }) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            var formData = new FormData();
            formData.append("name", role.name);
            formData.append("description", role.description);


            for (let i = 0; i < this.role.permission_id.length; i++) {
                formData.append('permissions[]', this.role.permission_id[i]);
              }

            // formData.append("name", role.name);

            try {
              await ksbTechApi
                .post(roles,formData, {
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

                    this.getAllRoles()

                    this.router.push('/roles')
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
        async updateRole(role:{
            id:string,
            name:string,
            description:string,
            permission_id:string
        }) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            var formData = new FormData();
            formData.append("name", role.name);
            formData.append("description", role.description);


            for (let i = 0; i < this.role.permission_id.length; i++) {
                formData.append('permissions[]', this.role.permission_id[i]);
              }

            // formData.append("name", role.name);

            try {
              await ksbTechApi
                .post(roles + '/' + role.id ,formData, {
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
                    this.getAllRoles()
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
        async deleteRole(
            id:string,
           ) {
            const { notify } = useNotification();
            const store = useAuthStore();
            this.loading = true

            try {
              await ksbTechApi
                .delete(roles + '/' + id, {
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
                    this.getAllRoles()
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
