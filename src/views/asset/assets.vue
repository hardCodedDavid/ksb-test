<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAssetStore } from "../../stores/asset";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";

const {
  getAllAsset,
  deleteAsset,
  createAssets,
  restoreAsset,
  updateAssets,
  getAllNetworks,
  getSingleAsset,
} = useAssetStore();
const {
  allTransactions,
  loading,
  dialog,
  asset,
  assets,
  all_networks,
  dialog2,
  asset_details,
} = storeToRefs(useAssetStore());

const header = ref([
  {
    title: "No.",
  },
  {
    title: "Icon",
  },
  {
    title: "Asset name",
  },
  {
    title: "Code",
  },

  {
    title: "Buy rate",
  },
  {
    title: "Sell rate",
  },
  {
    title: "Created At",
  },
  {
    title: "Actions",
  },
]);
const name = ref('')
const code = ref('')
const page = ref(1)

onMounted(async () => {
  await getAllAsset(page.value, name.value, code.value);
  await getAllNetworks();
});

// CHANGE STATUS COLOR
type StatusType = "pending" | "transferred" | "declined";

const status_color = (status: StatusType) => {
  return status == "pending"
    ? "yellow lighten-3"
    : status == "transferred"
    ? "green lighten-3"
    : status == "declined"
    ? "red lighten-3"
    : "";
};
//

const get_selected_file = (e: any) => {
  asset.value.icon = e.target.files[0];
};


</script>

<template>
  <v-row>
    <v-col cols="12" sm="12" class="mt-4">
      <div class="w-full d-flex justify-space-between my-3">
        <h2>All Assets</h2>
        <v-btn
          prepend-icon="mdi-plus"
          @click="dialog = true"
          variant="flat"
          color="secondary"
        >
          Create New Asset
        </v-btn>
      </div>
      <v-card class="pa-5">
       <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              variant="outlined"
              label="Asset name*"
              v-model="name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              variant="outlined"
              label="Asset code*"
              v-model="code"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn @click="name !== '' || code !== '' ? getAllAsset(page, name, code): null" color="secondary" block>Search</v-btn>
          </v-col>
        </v-row>
        <v-table>
          <thead>
            <tr>
              <th
                v-for="(headings, index) in header"
                :key="index"
                class="text-left"
              >
                {{ headings.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="assets?.data?.length > 0 && loading == false">
            <tr v-for="(item, index) in assets.data" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <v-avatar size="50px">
                  <v-img
                    cover
                    class="rounded-circle img-fluid img-size"
                    :src="item?.icon"
                  ></v-img>
                </v-avatar>
              </td>
              <td :class="{ 'font-weight-bold': item.account_name == null }">
                {{ item.name ?? "No name" }}
              </td>
              <td>{{ item.code }}</td>
              <td>₦‎{{ item.buy_rate }}</td>
              <td>₦‎{{ item.sell_rate }}</td>
              <td>
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY hh:mm a").value }}
              </td>

              <td>
                <v-row justify="center">
                  <v-menu transition="scroll-x-transition">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        text
                        icon="mdi-dots-vertical"
                        color="transparent"
                        class="ma-2"
                        v-bind="props"
                      >
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="
                          dialog2 = true;
                          getSingleAsset(item?.id);
                        "
                        link
                        color="secondary"
                      >
                        <v-list-item-title> View Asset </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="restoreAsset(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Restore Asset </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="deleteAsset(item?.id)"
                        link
                        color="secondary"
                      >
                        <v-list-item-title> Delete Asset </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
            </tr>
          </tbody>
        </v-table>

        <p
          class="font-weight-bold text-center my-3"
          v-if="assets?.data?.length <= 0 && loading == false"
        >
          No data found
        </p>

        <v-layout
          v-if="loading == true"
          class="align-center justify-center w-100 my-5"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
      </v-card>

       <v-pagination
        v-model="page"
        :length="assets.last_page"
        @next="getAllAsset(page, name, code)"
        @prev="getAllAsset(page, name, code)"
        @update:modelValue="getAllAsset(page, name, code)"
        active-color="red"
        :start="1"
        variant="flat"
        class="mt-5"
        color="bg-secondary"
        rounded="circle"
      ></v-pagination>
    </v-col>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card :loading="loading">
          <h3 class="text-h5 font-weight-bold pa-7">Create new asset</h3>
          <v-card-text>
            <v-container>
              <v-form @submit.prevent="createAssets(asset)">
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="asset.name"
                      variant="outlined"
                      label="Asset name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="asset.code"
                      variant="outlined"
                      label="Asset Short Code*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      variant="outlined"
                      label="Asset Icon*"
                      required
                      @change="get_selected_file"
                      prepend-icon=""
                      append-inner-icon="mdi-paperclip"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.buy_rate"
                      variant="outlined"
                      label="Buy Rate*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="asset.sell_rate"
                      variant="outlined"
                      label="Sell Rate*"
                      required
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                      :items="all_networks"
                      multiple
                      v-model="asset.network_id"
                      label="Select Networks"
                      required
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    class="px-7"
                    variant="outlined"
                    @click="dialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="secondary"
                    class="px-12"
                    :loading="loading"
                    variant="flat"
                    type="submit"
                  >
                    Create Asset
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <h3 class="text-center my-4">Asset Details</h3>
          <v-layout
            v-if="loading == true"
            class="align-center justify-center w-100 my-5"
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <v-container v-else class="fill-height">
            <div class="d-flex flex-column">
              <div class="d-flex align-center justify-space-between w-full">
                <div>
                  <h4 class="text-grey font-weight-light">Name</h4>
                  <div class="d-flex align-center">
                    <v-avatar size="50px">
                      <v-img
                        class="img-fluid rounded-circle img-size"
                        cover
                        :src="asset_details?.icon"
                      ></v-img>
                    </v-avatar>
                    <p class="ml-3 font-weight-bold">
                      {{ asset_details.name }}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 class="text-grey font-weight-light">Code</h4>
                  <p class="my-3 font-weight-bold">{{ asset_details.code }}</p>
                </div>
                <div>
                  <h4 class="text-grey font-weight-light">Buy Rate</h4>
                  <p class="my-3 font-weight-bold">
                    {{ asset_details.buy_rate }}
                  </p>
                </div>
                <div>
                  <h4 class="text-grey grey-darken-4 font-weight-light">
                    Sell Rate
                  </h4>
                  <p class="my-3 font-weight-bold">
                    {{ asset_details.sell_rate }}
                  </p>
                </div>
              </div>
              <div v-if="asset_details?.networks?.length > 0" class="mt-8">
                <h3 class="text-grey font-weight-bold">
                  Network(s) that belong to this asset:
                </h3>

                <v-row class="">
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="network in asset_details?.networks"
                    :key="network?.id"
                  >
                    <div class="mb-2">
                      <h4 class="mb-1 text-grey font-weight-light">Name</h4>
                      <p class="font-weight-bold">{{ network.name }}</p>
                    </div>
                    <div class="mb-2">
                      <h4 class="mb-1 text-grey font-weight-light">
                        Wallet address
                      </h4>
                      <p class="font-weight-bold">
                        {{ network.wallet_address }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <p v-else class="text-center py-5">
                This asset has no related network
              </p>
            </div>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}

.text-grey {
  color: #afafaf;
}
</style>
