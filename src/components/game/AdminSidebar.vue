<template>
  <Sidebar
    v-model:visible="showSidebar"
    position="right"
    class="p-sidebar-md"
    @hide="emits('hide-admin-sidebar')"
  >
    <div class="d-flex flex-column">
      <h5 class="text-lg">Adicionar/Remover Administradores</h5>
      <PickList
        v-model="pickListValues"
        data-key="uid"
        @move-to-target="setAsAdmin"
        @move-to-source="removeAdmin"
      >
        <template #sourceHeader> Usuários comuns </template>
        <template #targetHeader> Administradores </template>
        <template #item="slotProps">
          <div>
            <span>{{ slotProps.item.name }}</span>
          </div>
        </template>
      </PickList>
    </div>
  </Sidebar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '~/composables/firebase'
import { setUserAdminPermission } from '~/composables/game'
const props = defineProps({
  usersInGame: {
    type: Array,
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
})
const showSidebar = ref(false)
watch(
  () => props.show,
  (val) => {
    if (val) showSidebar.value = true
  }
)
const emits = defineEmits(['hide-admin-sidebar'])
const pickListValues = ref([[], []])
watch(
  () => props.usersInGame,
  (val) => {
    loadPickListValues(val)
  }
)
const loadPickListValues = (val) => {
  const admins = []
  const commonUsers = []
  for (const usr of val) {
    if (usr.uid !== user.value.uid) {
      if (usr.data.isAdmin) {
        admins.push(usr)
      } else {
        commonUsers.push(usr)
      }
    }
  }
  pickListValues.value[0] = commonUsers
  pickListValues.value[1] = admins
}
loadPickListValues(props.usersInGame)
const route = useRoute()
const setAsAdmin = (event) => {
  setUserAdminPermission(route.params.gameUid, event.items[0].uid, true)
}
const removeAdmin = (event) => {
  setUserAdminPermission(route.params.gameUid, event.items[0].uid, false)
}
</script>

<style scoped>
.p-picklist :deep(.p-picklist-source-controls) {
  display: none;
}
.p-picklist :deep(.p-picklist-target-controls) {
  display: none;
}
.p-picklist :deep(.p-button:nth-of-type(2n)) {
  display: none;
}
</style>
