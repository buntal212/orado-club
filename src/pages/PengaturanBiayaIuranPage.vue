<template>
  <q-page class="fee-page">
    <main class="fee-content">
      <div class="page-heading">
        <q-btn
          round
          flat
          icon="arrow_back"
          color="white"
          aria-label="Kembali"
          @click="router.push('/pengaturan')"
        />
        <div>
          <span>PENGATURAN CLUB</span>
          <h1>Biaya Iuran</h1>
        </div>
      </div>

      <section class="fee-card">
        <div class="fee-icon"><q-icon name="payments" /></div>
        <h2>Iuran anggota bulanan</h2>
        <p>Nominal ini menjadi acuan iuran rutin setiap anggota Club.</p>
        <q-input
          v-model="formattedFee"
          outlined
          prefix="Rp"
          label="Nominal iuran"
          inputmode="numeric"
          @focus="selectFeeInput"
        />
        <q-btn
          unelevated
          no-caps
          color="positive"
          icon="save"
          label="Simpan biaya iuran"
          :loading="saving"
          class="save-button"
          @click="saveFee"
        />
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'

const router = useRouter()
const biayaIuran = ref(0)
const saving = ref(false)
const formattedFee = computed({
  get: () => new Intl.NumberFormat('id-ID').format(biayaIuran.value),
  set: (value) => {
    biayaIuran.value = Number(String(value).replace(/\D/g, '')) || 0
  },
})

function selectFeeInput(event) {
  if (Number(biayaIuran.value) === 0) event.target.select()
}

async function getFee() {
  try {
    const response = await api.get('/v2/club/pengaturan/biaya-iuran')
    biayaIuran.value = Number(response.data?.data?.biaya_iuran || 0)
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Biaya iuran gagal dimuat.',
    })
  }
}

async function saveFee() {
  saving.value = true
  try {
    const response = await api.put('/v2/club/pengaturan/biaya-iuran', {
      biaya_iuran: biayaIuran.value,
    })
    biayaIuran.value = Number(response.data?.data?.biaya_iuran || 0)
    Notify.create({
      type: 'positive',
      message: response.data?.message || 'Biaya iuran berhasil diperbarui.',
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message:
        error.response?.data?.errors?.biaya_iuran?.[0] ||
        error.response?.data?.message ||
        'Biaya iuran gagal disimpan.',
    })
  } finally {
    saving.value = false
  }
}

onMounted(getFee)
</script>

<style scoped>
.fee-page {
  min-height: calc(100vh - 58px);
  padding: 16px 14px 36px;
  background: linear-gradient(180deg, #006b4f 0, #007354 180px, #eef6f2 180px);
}
.fee-content {
  max-width: 500px;
  margin: auto;
}
.page-heading {
  display: grid;
  grid-template-columns: 46px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 104px;
  color: #fff;
}
.page-heading :deep(.q-btn) {
  background: rgba(255, 255, 255, 0.12);
}
.page-heading span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  opacity: 0.72;
}
.page-heading h1 {
  margin: 4px 0 0;
  font-size: 25px;
  line-height: 1.05;
}
.fee-card {
  padding: 22px 18px 18px;
  border: 1px solid #d8e9e2;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(3, 73, 53, 0.12);
}
.fee-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  color: #08a849;
  background: #e4f8ea;
  font-size: 25px;
}
.fee-card h2 {
  margin: 15px 0 4px;
  color: #174c3d;
  font-size: 17px;
}
.fee-card p {
  margin: 0 0 18px;
  color: #789087;
  font-size: 11px;
  line-height: 1.5;
}
.fee-card :deep(.q-field__control) {
  min-height: 48px;
  border-radius: 11px;
}
.save-button {
  width: 100%;
  min-height: 46px;
  margin-top: 14px;
  border-radius: 12px;
  font-weight: 800;
}
</style>
