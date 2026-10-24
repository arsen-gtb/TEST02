new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],
        tracking: {
            "DO2025-0001": {
                nim: "123456789",
                nama: "Rina Wulandari",
                status: "Dalam Perjalanan",
                ekspedisi: "REG",
                tanggalKirim: "2025-08-25",
                paket: "PAKET-UT-001",
                total: 120000,
                perjalanan: [
                    { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                    { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" }
                ]
            }
        },
        // State Form Order
        formOrder: { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' }
    },
    watch: {
        // Watcher 1: Melacak perubahan paket pilihan untuk konfirmasi log di console
        'formOrder.paket': function(newPaket) {
            if(newPaket) {
                console.log(`User sedang meninjau detail untuk ${newPaket}`);
            }
        },
        // Watcher 2: Menyetel otomatis tanggal hari ini jika user mengosongkan tanggal pengisian
        'formOrder.nama': function(newNama) {
            if(newNama && !this.formOrder.tanggalKirim) {
                const hariIni = new Date().toISOString().split('T')[0];
                this.formOrder.tanggalKirim = hariIni;
            }
        }
    },
    computed: {
        // Menemukan detail info paket yang sedang diseleksi user
        detailPaketTerpilih: function() {
            return this.paket.find(p => p.kode === this.formOrder.paket) || null;
        },
        // Generate otomatis Serial Number baru DO (cth: DO2025-0002)
        nextDoNumber: function() {
            const keys = Object.keys(this.tracking);
            const currentYear = new Date().getFullYear();
            if (keys.length === 0) return `DO${currentYear}-0001`;
            
            const lastKey = keys[keys.length - 1]; // Mengambil kunci DO terakhir
            const lastSequence = parseInt(lastKey.split('-')[1]);
            const nextSequence = String(lastSequence + 1).padStart(4, '0');
            
            return `DO${currentYear}-${nextSequence}`;
        }
    },
    methods: {
        buatOrder: function() {
            const doBaru = this.nextDoNumber;
            const detailHarga = this.detailPaketTerpilih ? this.detailPaketTerpilih.harga : 0;
            
            // Masukkan data baru ke object tracking (Reaktivitas Vue 2)
            Vue.set(this.tracking, doBaru, {
                nim: this.formOrder.nim,
                nama: this.formOrder.nama,
                status: "Persiapan Pengiriman",
                ekspedisi: this.formOrder.ekspedisi,
                tanggalKirim: this.formOrder.tanggalKirim,
                paket: this.formOrder.paket,
                total: detailHarga,
                perjalanan: [
                    { waktu: new Date().toLocaleString('id-ID'), keterangan: "Dokumen DO berhasil diterbitkan di sistem SITTA UT." }
                ]
            });

            alert(`Order berhasil dibuat dengan nomor ${doBaru}!`);
            
            // Reset fields
            this.formOrder = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' };
        }
    }
});