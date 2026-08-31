<template>
  <q-page class="club-page">
    <main class="club-content">
      <section class="profile-card">
        <div class="profile-avatar"><img src="@/assets/orado/logo-white.svg" alt="ORADO" /></div>
        <div class="col">
          <span class="greeting">DASHBOARD CLUB</span>
          <strong>{{ currentUser?.name || currentUser?.username || 'Pengguna Club' }}</strong>
          <p>Kelola anggota, iuran, pemasukan, pengeluaran, dan laporan club dari sini.</p>
        </div>
      </section>

      <div class="section-label">MENU APLIKASI</div>
      <section class="menu-panel">
        <div class="menu-grid">
          <q-card
            v-for="menu in menus"
            :key="menu.title"
            flat
            bordered
            class="menu-card"
            :class="{ 'menu-card--clickable': menu.to }"
            @click="openMenu(menu)"
          >
            <q-card-section
              ><q-icon :name="menu.icon" color="positive" size="25px" /><span>{{
                menu.title
              }}</span></q-card-section
            >
          </q-card>
        </div>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'

const router = useRouter()
const loginStore = useLoginStore()
const currentUser = ref(
  loginStore.user || JSON.parse(localStorage.getItem('orado_club_user') || 'null'),
)
const menus = [
  { title: 'Data Anggota Club', icon: 'groups', to: '/anggota' },
  { title: 'Iuran Anggota', icon: 'payments', to: '/iuran' },
  { title: 'Pemasukan', icon: 'south' },
  { title: 'Pengeluaran', icon: 'north' },
  { title: 'Laporan', icon: 'description' },
  { title: 'Pengaturan', icon: 'settings', to: '/pengaturan' },
]

function openMenu(menu) {
  if (menu.to) router.push(menu.to)
}

onMounted(async () => {
  currentUser.value = await loginStore.getUser()
})
</script>

<style scoped>
.club-page {
  min-height: calc(100vh - 58px);
  padding: 0 14px 92px;
  background: linear-gradient(#006b4f 0, #006b4f 86px, #f7f9fc 86px);
}
.club-content {
  max-width: 430px;
  margin: auto;
}
.profile-card {
  position: relative;
  top: 14px;
  display: flex;
  min-height: 116px;
  align-items: center;
  gap: 13px;
  padding: 17px 15px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(3, 73, 53, 0.14);
}
.profile-avatar {
  display: grid;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #006b4f;
}
.profile-avatar img {
  display: block;
  width: 52px;
  height: 52px;
  object-fit: contain;
  object-position: center;
  transform: translateX(1px);
}
.greeting {
  color: #667b73;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.35px;
}
.profile-card strong {
  display: block;
  color: #174c3d;
  font-size: 13px;
}
.profile-card p {
  margin: 3px 0 0;
  color: #718c84;
  font-size: 9px;
  line-height: 1.4;
}
.section-label {
  margin: 35px 2px 10px;
  color: #24483e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.55px;
}
.menu-panel {
  padding: 10px;
  border: 1px solid #dce9e4;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(3, 73, 53, 0.05);
}
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}
.menu-card {
  min-height: 102px;
  border-radius: 11px;
  background: #fdfffe;
}
.menu-card :deep(.q-card__section) {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 5px;
  color: #1e4d3f;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}
.menu-card :deep(.q-icon) {
  font-size: 28px !important;
}
.menu-card--clickable {
  cursor: pointer;
}
.menu-card--clickable:active {
  background: #effaf5;
  transform: translateY(1px);
}
</style>
