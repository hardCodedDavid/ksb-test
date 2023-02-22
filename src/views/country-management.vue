<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCountryStore } from "../stores/country";
const { countryMgt, loading } = storeToRefs(useCountryStore());
const { getCountryMgt, giftcardActivation, registrationActivation } =
  useCountryStore();
const countryHeader = reactive([
  {
    title: "No.",
  },
  {
    title: "Country flag",
  },
  {
    title: "Name",
  },
  {
    title: "Giftcard Activation",
  },

  {
    title: "Registration Activation",
  },
  {
    title: "Dialing code",
  },

  {
    title: "Actions",
  },
]);

const heading = ref("Country Management");

onMounted(async () => {
  await getCountryMgt();
});

const blockedStatus = (status: string | null) => {
  return !status ? "Activated" : "Not active";
};
const regStatus = (status: string | null) => {
  return !status ? "Registered" : "Not registered";
};
const statusColor = (status: string | null) => {
  return !status ? "green lighten-3" : "red lighten-3";
};
</script>

<template>
  <div>
    <h3 class="my-4">{{ heading }}</h3>
    <v-card>
      <v-table>
        <thead class="pa-2">
          <tr class="pa-2">
            <th
              :key="index"
              v-for="(headerTitle, index) in countryHeader"
              class="text-left"
            >
              {{ headerTitle.title }}
            </th>
          </tr>
        </thead>
        <tbody v-if="loading == false">
          <tr v-for="(countries, index) in countryMgt" :key="countries.id">
            <td>{{ index + 1 }}</td>
            <td>
              <v-avatar size="45px">
                <v-img
                  cover
                  :src="countries?.flag_url ?? 'https://via.placeholder.com/15'"
                  class="rounded-circle img-fluid"
                >
                </v-img>
              </v-avatar>
            </td>

            <td>{{ countries.name }}</td>
            <td>
              <v-chip
                label
                class="pa-2"
                :color="statusColor(countries.giftcard_activated_at)"
              >
                {{ blockedStatus(countries.giftcard_activated_at) }}
              </v-chip>
            </td>
            <td>
              <v-chip
                label
                class="pa-2"
                :color="statusColor(countries.registration_activated_at)"
              >
                {{ regStatus(countries.registration_activated_at) }}
              </v-chip>
            </td>
            <td>{{ countries.dialing_code }}</td>

            <td>
              <v-row justify="center">
                <v-menu transition="scroll-y-transition">
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
                      @click="registrationActivation(countries.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        Toggle registration activation</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item
                      @click="giftcardActivation(countries.id)"
                      link
                      color="secondary"
                    >
                      <v-list-item-title>
                        Toggle giftcard activation
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-layout
        v-if="loading == true"
        class="align-center justify-center w-100 my-5"
      >
        <v-progress-circular indeterminate></v-progress-circular>
      </v-layout>
    </v-card>
  </div>
</template>

<style scoped>
table tbody tr td {
  padding: 15px !important;
}
</style>
