<template>
  <q-page class="registration-page">
    <main class="registration-content">
      <section class="registration-card">
        <div class="page-heading">
          <div><span>PENDAFTARAN CLUB</span><h1>Daftarkan club Anda</h1><p>Lengkapi data club untuk diajukan ke pengurus ORADO Kota Probolinggo.</p></div>
          <q-btn round flat icon="arrow_back" color="positive" aria-label="Kembali" @click="router.push('/')" />
        </div>

        <q-form class="club-form" @submit="store.saveData">
          <q-input v-model.trim="store.form.nama_club" outlined label="Nama club" />
          <q-input v-model.trim="store.form.username" outlined label="Username" autocomplete="username" />
          <q-input v-model="store.form.password" outlined type="password" label="Password" autocomplete="new-password" />
          <q-input v-model="store.form.password_confirmation" outlined type="password" placeholder="Ketik ulang password" aria-label="Ketik ulang password" autocomplete="new-password" />
          <q-input v-model.trim="store.form.alamat" outlined type="textarea" autogrow label="Alamat" />
          <q-select
            v-model="store.form.kecamatan"
            outlined
            emit-value
            map-options
            label="Kecamatan"
            :options="store.kecamatanOptions"
            :loading="store.loadingKecamatan"
            @update:model-value="store.pilihKecamatan"
          />
          <q-select
            v-model="store.form.kelurahan"
            outlined
            emit-value
            map-options
            label="Kelurahan"
            :options="store.kelurahanOptions"
            :loading="store.loadingKelurahan"
            :disable="!store.form.kecamatan"
          />
          <q-input v-model.trim="store.form.catatan" outlined type="textarea" autogrow label="Catatan (opsional)" />
          <q-btn unelevated no-caps type="submit" color="positive" icon="send" label="Kirim pendaftaran club" :loading="store.saving" class="submit-button" />
        </q-form>
        <p class="support-by">Support by CV. UDUMBARA INFORMATIKA</p>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePendaftaranClubStore } from '@/stores/club/pendaftaran'

const router = useRouter()
const store = usePendaftaranClubStore()

onMounted(() => {
  store.getKecamatan()
})
</script>

<style scoped>
.registration-page { min-height: calc(100vh - 58px); padding: 24px 14px 48px; background: linear-gradient(180deg, #006b4f 0, #006b4f 126px, #f1f6f3 126px); }.registration-content { max-width: 500px; margin: auto; }.registration-card { padding: 20px; border: 1px solid #d8e9e2; border-radius: 18px; background: #fff; box-shadow: 0 14px 30px rgba(3,73,53,.13); }.page-heading { display: flex; gap: 12px; justify-content: space-between; margin-bottom: 20px; }.page-heading span { color: #007157; font-size: 10px; font-weight: 800; letter-spacing: .7px; }.page-heading h1 { margin: 5px 0 0; color: #174c3d; font-size: 22px; }.page-heading p { max-width: 330px; margin: 7px 0 0; color: #708a81; font-size: 12px; line-height: 1.5; }.club-form { display: grid; gap: 13px; }.submit-button { min-height: 48px; margin-top: 5px; border-radius: 11px; font-weight: 700; }.support-by { margin: 18px 0 0; color: #82958c; font-size: 10px; font-weight: 600; text-align: center; }
</style>
