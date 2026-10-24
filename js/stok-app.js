new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        stok: [
            { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
            { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
            { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
            { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
        ],
        // State Filter & Form
        filterUpbjj: '',
        filterKategori: '',
        filterWarning: false,
        sortBy: 'judul',
        editIndex: null,
        formBaru: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: null, qty: null, safety: null }
    },
    watch: {
        // Watcher 1: Mengosongkan filter kategori jika filter UPBJJ dimatikan
        filterUpbjj: function (newVal) {
            if (!newVal) {
                this.filterKategori = '';
            }
        },
        // Watcher 2: Memberi log notifikasi setiap kali mode urut berubah (Contoh Watcher ke-2)
        sortBy: function (newSort) {
            console.log(`Daftar stok diurutkan berdasarkan kriteria: ${newSort}`);
        }
    },
    computed: {
        // Memastikan semua logika filter diproses terpusat & efisien (no-recompute unless trigger changes)
        filteredStok: function () {
            let data = [...this.stok];

            if (this.filterUpbjj) {
                data = data.filter(item => item.upbjj === this.filterUpbjj);
            }
            if (this.filterKategori) {
                data = data.filter(item => item.kategori === this.filterKategori);
            }
            if (this.filterWarning) {
                data = data.filter(item => item.qty === 0 || item.qty < item.safety);
            }

            // Urutkan (Sorting)
            data.sort((a, b) => {
                if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
                return a[this.sortBy] - b[this.sortBy];
            });

            return data;
        }
    },
    methods: {
        resetFilter: function () {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterWarning = false;
            this.sortBy = 'judul';
        },
        tambahStok: function () {
            this.stok.push({
                ...this.formBaru,
                catatanHTML: "<span>Data Input Manual</span>"
            });
            // Reset input form
            this.formBaru = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0 };
            alert("Bahan ajar sukses ditambahkan ke daftar stok.");
        }
    }
});