import { defineStore } from 'pinia';
import ksbTechApi from '../../axios';
import { asset, assets, all_network } from '../../apiRoute';
import { useNotification } from '@kyvg/vue3-notification';
import { useAuthStore } from './auth';
import { useRoute } from 'vue-router';
interface Data {
  id: string;
  account_name: string;
  amount: string;
  created_at: string;
  status: string;
  trade_type: string;
}

interface Asset {
  name: string;
  code: string;
  icon: string | Blob;
  buy_rate: string;
  sell_rate: string;
  id: string;
  network_id: [];
  networks?: [];
  _method?: string;
}

interface State {
  loading: boolean;
  dialog: boolean;
  dialog2: boolean;
  all_transactions: [];
  single_transactions: any;
  asset: Asset;
  assets: [];
  all_networks: [];
  asset_details: {};
}

export const useAssetStore = defineStore('asset', {
  state: (): State => ({
    loading: false,
    dialog: false,
    dialog2: false,
    all_transactions: [],
    single_transactions: [],
    asset: {
      name: '',
      code: '',
      icon: '',
      buy_rate: '',
      sell_rate: '',
      id: '',
      network_id: []
    },
    assets: [],
    all_networks: [],
    asset_details: {}
  }),
  getters: {
    allTransactions: (state) => state.all_transactions
  },
  actions: {
    // ASSETS TRANSACTION
    async getAllAssetTransactions(
      status: string = '',
      page: number = 1,
      type: string = '',
      reference: string = '',
      date_form: string = '',
      date_to: string = ''
    ) {
      console.log(status, page, type);
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            asset +
              '?filter[status]=' +
              status.toLowerCase() +
              '&filter[reference]=' +
              reference +
              '&page=' +
              page +
              '&filter[trade_type]=' +
              type.toLowerCase() +
              '&include=user' +
              '&per_page=100' +
              `&filter[creation_date]=${date_form}${
                date_form !== '' ? ',' + date_to : ''
              }`,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;

              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionsStatus(status: string, page: number) {
      // console.log(status, page, type)
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            asset + '?filter[status]=' + status.toLowerCase() + '&page=' + page,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionByTradeType(type: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            asset +
              '?filter[trade_type]=' +
              type.toLowerCase() +
              '&include=asset',
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionByReference(reference: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + '?filter[reference]=' + reference + '&include=asset', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
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
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionByDate(date: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + '?filter[creation_date]=' + date + '&include=asset', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
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
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllAssetTransactionsByUserId(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(asset + '?filter[user_id]=' + id + '&include=user', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transactions: { data: Data } };
              };
            }) => {
              this.loading = false;

              this.all_transactions = res.data.data.asset_transactions;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async partialApproveRequest(id: string, data: any) {
      const store = useAuthStore();
      const route: any = useRoute();
      const { notify } = useNotification();
      this.loading = true;

      var formdata = new FormData();
      formdata.append('complete_approval', '0');
      formdata.append('review_rate', data.review_rate);
      formdata.append('review_note', data.review_note);
      formdata.append('review_proof', data.review_proof);
      formdata.append('_method', 'PATCH');

      try {
        await ksbTechApi
          .post(asset + '/' + id + '/approve', formdata, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { withdrawal_requests: object };
              };
            }) => {
              this.loading = false;
              this.dialog2 = false;
              this.getSingleAssetTransactions(id);
              notify({
                title: 'Approved Successfully',
                text: res.data.message,
                type: 'success'
              });
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async getSingleAssetTransactions(id: string, page: number = 1) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            asset +
              '/' +
              id +
              '?include=asset,user,bank,network' +
              '&page=' +
              page,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { asset_transaction: Data };
              };
            }) => {
              this.loading = false;
              this.dialog = false;
              this.single_transactions = res.data.data.asset_transaction;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async approveAssetTransactions(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      var formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('complete_approval', '1');
      try {
        await ksbTechApi
          .post(asset + '/' + id + '/approve', formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              this.dialog = false;
              notify({
                title: 'Approval Successful',
                text: res.data.message,
                type: 'success'
              });
              this.getAllAssetTransactions('', 1, '');
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async declineAssetTransactions(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      var formData = new FormData();
      formData.append('_method', 'PATCH');
      if (confirm('Are you sure you want to decline this asset item ?')) {
        try {
          await ksbTechApi
            .post(asset + '/' + id + '/decline', formData, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            })
            .then(
              (res: {
                data: {
                  message: string;
                };
              }) => {
                this.loading = false;
                this.dialog = false;
                notify({
                  title: 'Decline Successful',
                  text: res.data.message,
                  type: 'success'
                });
                this.getAllAssetTransactions('', 1, '');
              }
            );
        } catch (error: any) {
          this.loading = false;
          notify({
            title: 'An Error Occurred',
            text: error.response.data.message,
            type: 'error'
          });
        }
      }
    },
    // ASSETS
    async getAllAsset(page: number = 1, name: string = '', code: string = '') {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            assets +
              '?include=networks,networksCount' +
              '&per_page=100' +
              '&page=' +
              page +
              '&filter[name]=' +
              name +
              '&filter[code]=' +
              code,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: { assets: any };
              };
            }) => {
              this.loading = false;

              this.assets = res.data.data.assets;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getSingleAsset(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(assets + '/' + id + '?include=networks', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { assets: any };
              };
            }) => {
              this.loading = false;

              this.asset_details = res.data.data.asset;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async createAssets(asset_t: Asset) {
      const store = useAuthStore();
      var formData = new FormData();

      this.loading = true;

      formData.append('name', asset_t.name);
      formData.append('code', asset_t.code);
      formData.append('icon', asset_t.icon);
      formData.append('buy_rate', asset_t.buy_rate);
      formData.append('sell_rate', asset_t.sell_rate);

      const ids = this.asset.network_id;

      for (let i = 0; i < ids.length; i++) {
        formData.append('networks[]', ids[i]);
      }

      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(assets, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.getAllAsset();
              this.dialog = false;
            }
          );
      } catch (error: any) {
        this.loading = false;

        const { notify } = useNotification();
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async updateAssets(asset_t: Asset) {
      const store = useAuthStore();
      var formData = new FormData();

      this.loading = true;

      formData.append('name', asset_t.name);
      formData.append('code', asset_t.code);
      formData.append('icon', asset_t.icon);
      formData.append('buy_rate', asset_t.buy_rate);
      formData.append('sell_rate', asset_t.sell_rate);
      formData.append('_method', 'PATCH');

      const { notify } = useNotification();
      try {
        await ksbTechApi
          .post(assets + '/' + asset_t.id, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.getAllAsset();
              this.dialog = false;
            }
          );
      } catch (error: any) {
        this.loading = false;

        const { notify } = useNotification();
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },

    async restoreAsset(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      try {
        await ksbTechApi
          .patch(assets + '/' + id + '/restore', '', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.getAllAsset();
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async deleteAsset(id: string) {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;

      try {
        await ksbTechApi
          .delete(assets + '/' + id, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
              };
            }) => {
              this.loading = false;
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.getAllAsset();
            }
          );
      } catch (error: any) {
        this.loading = false;
        notify({
          title: 'An Error Occurred',
          text: error.response.data.message,
          type: 'error'
        });
      }
    },

    async getAllNetworks() {
      const store = useAuthStore();
      const { notify } = useNotification();
      this.loading = true;
      try {
        await ksbTechApi
          .get(all_network, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: { assets: any };
              };
            }) => {
              this.loading = false;

              this.all_networks = res.data.data.networks.data;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    }
  }
});
