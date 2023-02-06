<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useAuthStore());

const userInitials = computed(() => {
  return user.value.email.slice(0, 2);
});

const tab = ref(null);

const model = ref(false);

// FILE SELECTION
const file = ref<null | any>(null);
const image = ref<string | URL>("");
const openFile = () => {
  file.value.click();
};
const selectFile = (e: any) => {
  image.value = URL.createObjectURL(e.target.files[0]);
};

const ImageOrBlob = computed(() => {
  return user.value.avatar === null ? image.value : user.value.avatar;
});
//
</script>

<template>
  <v-container>
    <h3>Profile Page</h3>
    <v-card class="my-4 pa-3">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="one">Profile Information</v-tab>
        <v-tab value="two">Permissions</v-tab>
        <v-tab value="three">Update Password</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-row
              no-gutters
              align="center"
              justify="center"
              class="my-4 w-100"
            >
              <v-col cols="12" sm="8" lg="6">
                <div class="w-100 d-flex align-center justify-center">
                  <v-badge
                    content="2"
                    color="secondary"
                    offset-x="6"
                    offset-y="76"
                    @click="openFile"
                    icon="mdi-camera"
                    :bordered="true"
                    class="cursor-pointer"
                  >
                    <v-avatar
                      color="red"
                      :size="80"
                      class="my-5 position-relative"
                    >
                      <v-img
                        v-if="ImageOrBlob !== ''"
                        :src="ImageOrBlob"
                      ></v-img>
                      <span v-else class="text-h5 text-uppercase">{{
                        userInitials
                      }}</span>
                    </v-avatar>
                  </v-badge>
                  <v-file-input
                    ref="file"
                    @change="selectFile"
                    class="d-none"
                  ></v-file-input>
                </div>

                <v-form>
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    variant="outlined"
                    color="secondary"
                  ></v-text-field>
                  <v-text-field
                    label="First name"
                    variant="outlined"
                    v-model="user.firstname"
                    color="secondary"
                  ></v-text-field>
                  <v-text-field
                    label="Last name"
                    v-model="user.lastname"
                    variant="outlined"
                    color="secondary"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.phonenumber"
                    label="Phone number"
                    variant="outlined"
                    color="secondary"
                  ></v-text-field>

                  <v-switch
                    v-model="model"
                    hide-details
                    inset
                    color="secondary"
                    :label="`Two factor Authentication: ${model.toString()}`"
                  ></v-switch>

                  <v-btn block color="secondary" class="my-4">
                    update profile
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="two"> Two </v-window-item>

          <v-window-item value="three"> Three </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
</style>