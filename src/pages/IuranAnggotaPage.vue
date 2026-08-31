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
          @click="router.push('/')"
        />
        <div>
          <span>KEUANGAN CLUB</span>
          <h1>Iuran Anggota</h1>
        </div>
      </div>
      <section class="card form-card">
        <div class="section-title">
          <span class="icon"><q-icon name="payments" /></span>
          <div><strong>Catat iuran</strong><small>Tambahkan pembayaran iuran anggota.</small></div>
        </div>
        <q-form class="form" @submit="saveFee">
          <q-select
            v-model="form.anggota_id"
            outlined
            dense
            emit-value
            map-options
            label="Anggota aktif"
            :options="memberOptions"
            :loading="loading"
          />
          <div class="form-grid">
            <q-input
              v-model="form.periode"
              outlined
              dense
              type="month"
              label="Periode iuran"
            /><q-input
              v-model="form.tanggal_bayar"
              outlined
              dense
              type="date"
              label="Tanggal bayar"
            />
          </div>
          <q-input
            v-model="formattedNominal"
            outlined
            dense
            prefix="Rp"
            label="Nominal iuran"
            inputmode="numeric"
            readonly
          />
          <q-input
            v-model.trim="form.catatan"
            outlined
            dense
            type="textarea"
            autogrow
            label="Catatan (opsional)"
          />
          <q-btn
            unelevated
            no-caps
            type="submit"
            color="positive"
            icon="save"
            label="Simpan iuran"
            :loading="saving"
            class="save-button"
          />
        </q-form>
      </section>
      <section class="card list-card">
        <div class="section-title">
          <span class="icon"><q-icon name="receipt_long" /></span>
          <div>
            <strong>Riwayat iuran</strong><small>{{ pagination.total }} pembayaran tercatat.</small>
          </div>
        </div>
        <div class="history-filters">
          <q-select
            v-model="filters.search"
            outlined
            dense
            clearable
            use-input
            fill-input
            hide-selected
            emit-value
            map-options
            placeholder="Cari nama anggota"
            :options="paidMemberOptions"
            @filter="filterPaidMembers"
            @update:model-value="resetAndLoad"
            @clear="resetAndLoad"
            ><template #prepend><q-icon name="search" /></template
          ></q-select>
          <q-input
            v-model="filters.month"
            outlined
            dense
            clearable
            type="month"
            label="Bulan"
            @update:model-value="resetAndLoad"
          />
        </div>
        <div v-if="loading" class="state">
          <q-spinner color="positive" size="28px" /> Memuat iuran...
        </div>
        <div v-else-if="!fees.length" class="state">
          <q-icon name="receipt_long" size="30px" /> Belum ada iuran tercatat.
        </div>
        <q-virtual-scroll
          v-else
          :items="fees"
          :virtual-scroll-item-size="75"
          class="fee-scroll"
          separator
          v-slot="{ item: fee }"
          ><q-item :key="fee.id" class="fee-item"
            ><q-item-section avatar
              ><q-avatar color="green-1" text-color="positive" icon="person" /></q-item-section
            ><q-item-section
              ><q-item-label class="member-name">{{ fee.anggota.name }}</q-item-label
              ><q-item-label caption
                >{{ monthLabel(fee.periode) }} · Dibayar
                {{ dateLabel(fee.tanggal_bayar) }}</q-item-label
              ><q-item-label v-if="fee.catatan" caption>{{
                fee.catatan
              }}</q-item-label></q-item-section
            ><q-item-section side
              ><strong class="amount">{{ currency(fee.nominal) }}</strong></q-item-section
            ></q-item
          ></q-virtual-scroll
        >
        <div v-if="pagination.lastPage > 1" class="pager">
          <q-btn
            flat
            dense
            icon="chevron_left"
            :disable="pagination.page === 1"
            @click="changePage(-1)"
          />
          <span>Halaman {{ pagination.page }} / {{ pagination.lastPage }}</span>
          <q-btn
            flat
            dense
            icon="chevron_right"
            :disable="pagination.page === pagination.lastPage"
            @click="changePage(1)"
          />
        </div>
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
const loading = ref(false)
const saving = ref(false)
const members = ref([])
const fees = ref([])
const paidMemberOptions = ref([])
const currentMonth = new Date().toISOString().slice(0, 7)
const filters = ref({ search: '', month: currentMonth })
const pagination = ref({ page: 1, lastPage: 1, total: 0 })
const form = ref({
  anggota_id: null,
  periode: currentMonth,
  tanggal_bayar: new Date().toISOString().slice(0, 10),
  nominal: 0,
  catatan: '',
})
const memberOptions = computed(() =>
  members.value.map((member) => ({ label: `${member.name} · ${member.nik}`, value: member.id })),
)
const formattedNominal = computed({
  get: () => new Intl.NumberFormat('id-ID').format(form.value.nominal),
  set: (value) => {
    form.value.nominal = Number(String(value).replace(/\D/g, '')) || 0
  },
})
const currency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
const dateLabel = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
const monthLabel = (value) =>
  new Date(`${value.slice(0, 7)}-01T00:00:00`).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })

async function loadData(loadMembers = false) {
  loading.value = true
  try {
    const requests = [
      api.get('/v2/club/iuran', {
        params: {
          search: filters.value.search || undefined,
          month: filters.value.month || undefined,
          page: pagination.value.page,
          per_page: 15,
        },
      }),
    ]
    if (loadMembers) requests.unshift(api.get('/v2/club/anggota'))
    const responses = await Promise.all(requests)
    const feeResponse = responses.at(-1)
    if (loadMembers) members.value = responses[0].data?.data ?? []
    fees.value = feeResponse.data?.data ?? []
    pagination.value = {
      page: feeResponse.data?.meta?.current_page || 1,
      lastPage: feeResponse.data?.meta?.last_page || 1,
      total: feeResponse.data?.meta?.total || 0,
    }
    form.value.nominal = Number(feeResponse.data?.meta?.biaya_iuran || 0)
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Data iuran gagal dimuat.',
    })
  } finally {
    loading.value = false
  }
}
function resetAndLoad() {
  pagination.value.page = 1
  loadData()
}
async function filterPaidMembers(value, update) {
  filters.value.search = value
  pagination.value.page = 1
  try {
    const [response] = await Promise.all([
      api.get('/v2/club/iuran/anggota', { params: { search: value || undefined } }),
      loadData(),
    ])
    const options = (response.data?.data ?? []).map((member) => ({
      label: `${member.name} · ${member.nik}`,
      value: member.name,
    }))
    update(() => {
      paidMemberOptions.value = options
    })
  } catch {
    update(() => {
      paidMemberOptions.value = []
    })
  }
}
function changePage(offset) {
  pagination.value.page += offset
  loadData()
}
async function saveFee() {
  saving.value = true
  try {
    const response = await api.post('/v2/club/iuran', form.value)
    Notify.create({
      type: 'positive',
      message: response.data?.message || 'Iuran berhasil dicatat.',
    })
    form.value.anggota_id = null
    form.value.catatan = ''
    await loadData()
  } catch (error) {
    const errors = error.response?.data?.errors
    Notify.create({
      type: 'negative',
      message:
        errors?.anggota_id?.[0] ||
        errors?.periode?.[0] ||
        errors?.nominal?.[0] ||
        errors?.tanggal_bayar?.[0] ||
        errors?.catatan?.[0] ||
        error.response?.data?.message ||
        'Iuran gagal disimpan.',
    })
  } finally {
    saving.value = false
  }
}
onMounted(() => loadData(true))
</script>

<style scoped>
.fee-page {
  min-height: calc(100vh - 58px);
  padding: 16px 14px 36px;
  background: linear-gradient(180deg, #006b4f 0, #007354 185px, #eef6f2 185px);
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
.card {
  padding: 16px;
  border: 1px solid #d8e9e2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(3, 73, 53, 0.12);
}
.form-card {
  margin-bottom: 15px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  color: #08a849;
  background: #e4f8ea;
  font-size: 21px;
}
.section-title div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.section-title strong {
  color: #174c3d;
  font-size: 14px;
}
.section-title small {
  color: #789087;
  font-size: 10px;
}
.form {
  display: grid;
  gap: 9px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
.form :deep(.q-field__control) {
  min-height: 44px;
  border-radius: 10px;
}
.save-button {
  min-height: 44px;
  border-radius: 11px;
  font-weight: 800;
}
.history-filters {
  display: grid;
  grid-template-columns: 1fr 130px;
  gap: 8px;
  margin-bottom: 10px;
}
.history-filters :deep(.q-field__control) {
  min-height: 40px;
  border-radius: 10px;
}
.fee-scroll {
  max-height: 320px;
}
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  color: #71877e;
  font-size: 10px;
  font-weight: 700;
}
.state {
  display: flex;
  min-height: 125px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #789087;
  font-size: 11px;
  text-align: center;
}
.fee-item {
  padding: 11px 2px;
}
.fee-item :deep(.q-item__section--avatar) {
  min-width: 45px;
}
.member-name {
  color: #174c3d;
  font-weight: 800;
}
.fee-item :deep(.q-item__label--caption) {
  color: #789087;
  font-size: 10px;
}
.amount {
  color: #08a849;
  font-size: 11px;
  white-space: nowrap;
}
</style>
