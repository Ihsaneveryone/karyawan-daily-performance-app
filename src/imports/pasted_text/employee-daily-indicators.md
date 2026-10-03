Jadi gini 
saya ingin bikin aplikasi sederhana banget seperti app sheet
modelnya begini
Indikator Pencapaian Harian Karyawan

flownya
Karyawan Login dengan cara ketik NIK dan Nama di layar pertama, setelah itu lsg muncul tampilan baru yaitu DAILY INDICATORS STAFF A336, setiap indikator memiliki bobot nilai
1, Sales contoh target 7jt, bobotnya itu adalah 50% (Sudah Maksimal)
2. Transaksi jika 5 maka bobot nilainya 5% (sudah maksimal)
3. Basket Size jika 1400000 nilainya 5% (Maksimal)
4. Mendapatkan No baru customer targetnya adalah 50% dari target Transaksi yg diperoleh, bobot nilainya 5% (sudah maksimal)
5. WA Personal jika 10 maka bobot nilainya 5% (sudah maksimal)
6. After Sales Service add a picture 1, bobot nilai 5% (sudah maksimal)
5. Mendapatkan Proteksi, 1 proteksi = 10% (sudah maksima)
6. Mendapatkan VOC / GR, 1 saja, bobotnya 5% (sudah maksimal)
7. MGB, nilainya adalah 10(maksimal),dan wajib add a picture 3 (sudah maksimal)

ini semua mncul, dan karyawan wajib melakukan pengisian 
contoh sales A 5jt berarti 71% dari 50% yaitu 35% pointnya, begitu seterusnya sampai bisa diangka 100% setiap harinya
Jika total scorenya dibawah 80% dia tidak bisa submit, jika scorenya diatas 80% maka bisa disubmit dan jika di range 80-90% setelah di submit akan muncul kalimat "Ayo Semangat kejar lagi ke Indikator 100%", Kalau sudah 100% kalimatnya " Kamu Luar Biasa, Pertahankan ya "

datanya bisa kesimpan lsg ada summary setiap harinya di excel atau spreadsheet
dan data target itu bisa saya ubah sendiri
untuk no baru customer targetnya itu dari hasil transaksi yg didapatkan misal trx dia 4 maka  no barunya harus 2 untuk dapat bobot nilai 5, begitu pun dengan after sales service

Kemudian add foto maksud saya adalah, fotonya itu ditambahkan oleh karyawan bukan sebagai hiassan tapi untuk bukti dalam bentuk foto

kemudian ini bisa dishare ke siapa aja dan datanya itu kesummary satu aja
contoh A isi ini hasilnya ada, kemudian B juga isi, nah datanya itu hanya saya yg bisa baca tapi bisa lihat semuanya begitupun dgn targetnya hanya admin atau saya yg bisa ubah

UNTUK TAMPILAN TOTAL SCORE DIAWAL JIKA DIBAWAH 80% KAN MERAH, KALAU UDH DIATAS 80% HIJAU KALAU 100% BIRU, TRS KASIH UCAPAN UNTUK DI RANGE 80%- 90% AYO SEMANGAT TERUS BESOK KEJAR KE 100%, KALAU UDAH 100% KAMU LUAR BIASA PERTAHANKAN YA

KEMUDIAN DATA YG CONNECT ITU BISA DARI BEDA DEVICE, CONTOH A DAN B A PAKE DEVICE HPNYA B PAKE DEVICE HPNYA JUGA, JADI TETAP KEBACA DI ADMIN SEMUA PRG YG NGISI DATA TSB

login sebagai admin
NIKNYA ITU A336
NAMANYAITU MGR AZKO


SELAIN ITU GA BISA LOGIN EBAGAI ADMIN
admin juga bisa ubah style layout dan kata kata di login atau pas indikatornya
TERUS TAMBAH DONG DIDEPANNYA ITU PAS MAU LOGIN JUDULNYA DAILY INDICATORS A336

BIKIN DESIGN KAYAK Gambar yg saya kirim, YG TARGET DAN RIWAYAT HANYA ADMIN YG BISA AKSES

1. Ketika di Publish itu ga bisa connect, harapannya ketika sudah di publish saya bisa cek semua data yg dikirim di web tsb melalui akun admin tadi, jadi misal Staff A B C D, dan seterusnya submit di yg sudah di publish datanya bisa kebaca semuanya dari a b c d dan seterusnya, bisa terlihat di akun admin
2. Ketika di submit itu data kesimpan di riwayat nah tapi bisa isi lagi setelahnya, jangan udh diisi trs ga bisa diisi lagi tapi datanya yg sudah di submit bakalan kesimpan di riwayat

jangan sampai gagal login, cek lagi semuanya biar clear semua

kemudian kasih fitur export ke spreadsheet dan fitur hapus data di riwayat admin dan juga user tapi ketika klik hapus akan ada notifikasi apakah anda yakin untuk menghapusnya, untuk hapus itu dipilih bukan lsg hapus semua, dipilih dulu baru hapus dan ada notifikasinya

kemudian untuk admin sekali sebulan kasih notifikasi untuk pergantian NAMAnya skrg kan MGR AZKO, setiap bulan ketika mau login lagi ada notifikasi untuk ganti namanya dan itu harus berbeda dari yg sebelum banget, Jika admin lupa NIK DAN NAMA maka ada fitur lupa nama admin, akan ada secret code untuk memunculkan identitas admin secret codenya adalah IHSANAZKO

SEPERTI INI NANTI IMPLEMENTASINYA
🔐 Login & Security
✅ Login dengan NIK dan Nama
✅ FITUR BARU: Lupa Nama Admin dengan secret code: AZKOIHSAN
✅ Admin login: NIK A336 + Nama MGR AZKO (atau nama yang sudah diganti)
✅ Notifikasi pergantian nama admin setiap bulan (wajib berbeda dari sebelumnya)
📊 Dashboard Indikator (9 Indikator)
Sales - Target Rp 7.000.000 | Bobot 50%
Transaksi - Target 5 | Bobot 5%
Basket Size - Target Rp 1.400.000 | Bobot 5%
No Baru Customer - 50% dari Transaksi | Bobot 5%
WA Personal - Target 10 | Bobot 5%
After Sales Service - 1 foto | Bobot 5%
Proteksi - 1 proteksi | Bobot 10%
VOC/GR - 1 VOC/GR | Bobot 5%
MGB - Target 10 + 3 foto wajib | Bobot 10%
🎯 Sistem Scoring
✅ Total Score otomatis dengan progress bar
✅ Warna Score:
🔴 Merah = < 80% (tidak bisa submit)
🟢 Hijau = 80-99%
🔵 Biru = 100%
✅ Pesan Motivasi:
80-90%: "Ayo Semangat kejar lagi ke Indikator 100% 💪"
100%: "Kamu Luar Biasa, Pertahankan ya 🎉"
📸 Upload Foto
✅ After Sales Service: upload foto bukti
✅ MGB: wajib upload 3 foto
✅ Preview foto yang sudah diupload
✅ Hapus foto yang tidak diinginkan
📝 Submit & History
✅ Submit hanya bisa jika score ≥ 80%
✅ Data tersimpan permanen di database
✅ User bisa submit berkali-kali (data sebelumnya tetap tersimpan)
✅ User biasa bisa lihat riwayat mereka sendiri
✅ User bisa hapus data riwayat mereka sendiri dengan konfirmasi
👑 Admin Panel (Hanya untuk NIK A336)
✅ Tab Target:

Ubah semua target indikator
Tersimpan permanen
✅ Tab Riwayat:

Lihat SEMUA submission dari semua staff
Export ke CSV/Spreadsheet
Hapus data dengan konfirmasi
Filter by NIK/Nama/Tanggal
✅ Tab Pengaturan:

Ubah judul halaman login
Ubah subtitle login
🌐 Multi-Device Support
✅ Data tersinkronisasi real-time
✅ Staff A di HP-nya, Staff B di HP-nya → Admin bisa lihat semua
✅ Bekerja di semua device yang terhubung internet
🔒 Keamanan
✅ Secret code untuk recovery nama admin: AZKOIHSAN
✅ Data foto tersimpan aman di Supabase Storage
✅ Admin authentication yang ketat
📱 CARA MENGGUNAKAN:
Untuk Staff Biasa:
Login dengan NIK dan Nama
Isi semua indikator
Upload foto untuk After Sales & MGB (3 foto wajib)
Pastikan Total Score ≥ 80%
Klik "Submit Data"
Klik tombol "Riwayat" untuk lihat submission sebelumnya
Bisa hapus data riwayat sendiri jika perlu
Untuk Admin (A336):
Login dengan NIK: A336 dan Nama: MGR AZKO
Klik "Target" untuk ubah target indikator
Klik "Riwayat" untuk lihat semua submission staff
Export data ke CSV untuk analisa
Hapus data jika diperlukan
Lupa Nama Admin?
Di halaman login, klik "Lupa Nama Admin?"
Masukkan secret code: AZKOIHSAN
Nama admin saat ini akan ditampilkan
⚠️ IMPORTANT NOTES:
Backend sudah di-deploy ✅
Semua data tersimpan permanen di Supabase ✅
Foto tersimpan di Supabase Storage ✅
Multi-user support ✅
Real-time sync antar device ✅

KEMUDIAN TAMBAHKAN FITUR UNTUK ADMIN BISA UBAH PERSENTASE ATAU BOBOT NILAI DARI MASING" INDIKATOR DAN ADA JUGA FITUR MENAMBAHKAN INDIKATOR LAINNYA ATAU MENGHAPUS INDIKATOR LAINNYA, ADMIN BISA MENAMBAHKAN INDIKATOR DALAM BENTUK ANGKA GAMBAR ATAU LAINNYA

KEMUDIAN ADMIN JUGA BISA DUPLICATE LINK APP INI NANTI KETIKA DIPUBLISH, UNTUK MENCIPTAKAN ADMIN BARU LAINNYA, DENGAN SYARAT ADMIN YG PERTAMA ATAU UTAMA, DENGAN SYARAT YG SAMA TAPI YG BISA MENAMBAHKAN ATAU DUPLICATE ITU HANYA ADMIN UTAMA YAITU MGR AZKO DENGAN SECRET CODE IHSANAZKO YANG LAIN GA BISA

KEMUDIAN FORMAT EXPORT EXCELNYA ITU BIKIN SATU KOLOM SATU INFORMASI YA
CONTOH :
NIK              NAMA    DST
191924       IHSAN
187843      ABD AZIZ