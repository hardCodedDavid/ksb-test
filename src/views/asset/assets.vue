<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAssetStore } from "../../stores/asset";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";

const { getAllAsset, deleteAsset, createAssets, restoreAsset, updateAssets } =
  useAssetStore();
const { allTransactions, loading, dialog, asset, assets } = storeToRefs(
  useAssetStore()
);

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
onMounted(async () => {
  await getAllAsset();
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
          <tbody v-if="assets?.length > 0 && loading == false">
            <tr v-for="(item, index) in assets" :key="item.id">
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
                {{ useDateFormat(item?.created_at, "DD, MMMM-YYYY").value }}
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
          v-if="assets?.length <= 0 && loading == false"
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
                      label="Asset Code*"
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
  </v-row>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
