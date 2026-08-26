import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

const initialForm = () => ({
  nama_club: '',
  username: '',
  password: '',
  password_confirmation: '',
  alamat: '',
  kelurahan: '',
  kecamatan: '',
  catatan: '',
})

export const usePendaftaranClubStore = defineStore('pendaftaran-club', {
  state: () => ({
    saving: false,
    loadingKecamatan: false,
    loadingKelurahan: false,
    kecamatanOptions: [],
    kelurahanOptions: [],
    form: initialForm(),
  }),

  actions: {
    async getKecamatan() {
      this.loadingKecamatan = true
      try {
        const response = await api.get('/v2/wilayah/kecamatan')
        this.kecamatanOptions = (response.data?.data ?? []).map((item) => ({
          label: item.nama_kecamatan,
          value: item.kode,
        }))
      } catch (error) {
        const message = error.response?.data?.message || 'Data kecamatan gagal dimuat.'
        Notify.create({ type: 'negative', message })
      } finally {
        this.loadingKecamatan = false
      }
    },

    async pilihKecamatan(kodeKecamatan) {
      this.form.kelurahan = ''
      this.kelurahanOptions = []

      if (!kodeKecamatan) {
        return
      }

      this.loadingKelurahan = true
      try {
        const response = await api.get('/v2/wilayah/kelurahan', {
          params: { kode_kecamatan: kodeKecamatan },
        })
        this.kelurahanOptions = (response.data?.data ?? []).map((item) => ({
          label: item.nama_kelurahan,
          value: item.kode,
        }))
      } catch (error) {
        const message = error.response?.data?.message || 'Data kelurahan gagal dimuat.'
        Notify.create({ type: 'negative', message })
      } finally {
        this.loadingKelurahan = false
      }
    },

    async saveData() {
      this.saving = true
      try {
        const response = await api.post('/v2/club/pendaftaran', this.form)
        Notify.create({ type: 'positive', message: response.data?.message || 'Pendaftaran club berhasil dikirim.' })
        this.form = initialForm()
        this.kelurahanOptions = []
        return true
      } catch (error) {
        const message = Object.values(error.response?.data?.errors ?? {})?.[0]?.[0] || error.response?.data?.message || 'Pendaftaran club gagal dikirim.'
        Notify.create({ type: 'negative', message })
        return false
      } finally {
        this.saving = false
      }
    },
  },
})
