<template>
  <v-container>
    <v-card class="pa-6">
      <h2>Create role</h2>
      <v-row align="start">
        <v-col cols="12" sm="6">
          <v-form class="mt-8 py-8">
            <v-text-field
              v-model="role.name"
              label="Name"
              variant="outlined"
            ></v-text-field>
            <v-textarea
              v-model="role.description"
              label="Description"
              variant="outlined"
            ></v-textarea>
            <!-- <v-autocomplete
            v-model="role.permission_id"
            variant="outlined"
            label="Permissions"
            item-title="name"
            multiple
            item-value="id"
            :items="permissions"
          ></v-autocomplete> -->
            <v-btn
              :loading="loading"
              color="secondary"
              block
              @click="edit == true ? updateRole(role) : createRole(role)"
              >Submit</v-btn
            >
          </v-form>
        </v-col>

        <v-col class="mt-12" cols="12" sm="6">
          <h3>Select permissions</h3>
          <v-layout
            v-if="loading == true"
            class="align-center justify-center w-100 my-5"
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <v-checkbox
            v-else
            :label="permission.description"
            v-for="(permission, index) in permissions"
            :key="index"
            @click="role.permission_id.push(permission.id)"
            v-model="permission.id"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useRolesPermissionsStore } from "../../stores/roles-permissions";
const { getAllRoles, getAllPermissions, createRole, updateRole, deleteRole } =
  useRolesPermissionsStore();

const { roles, permissions, loading, dialog, role } = storeToRefs(
  useRolesPermissionsStore()
);

onMounted(async () => {
  await getAllRoles();
  await getAllPermissions();
});
</script>

<style scoped></style>
