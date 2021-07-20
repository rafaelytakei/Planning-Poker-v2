<template>
  <router-view v-slot="{ Component }">
    <Avatar
      v-if="user"
      label="A"
      class="avatar"
      size="large"
      shape="circle"
      @click="toggleMenu"
    />
    <TieredMenu ref="menu" :model="items" :popup="true" />
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, signUserOut } from '~/composables/firebase'

const menu = ref()
const user = ref(null)
const router = useRouter()
const items = ref([
  {
    label: 'Sair',
    icon: 'pi pi-fw pi-power-off',
    command: async () => {
      await signUserOut()
      user.value = null
      router.push({
        path: '/',
      })
    },
  },
])
const route = useRoute()
watch(route, async () => {
  console.log('changing route')
  user.value = await getUser()
})
onMounted(async () => {
  user.value = await getUser()
})
const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

/* .fade-enter-from {
  transform: rotateY(-90deg);
}
.fade-leave-to {
  transform: rotateY(90deg);
} */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.avatar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  background-color: var(--surface-900);
}
</style>
