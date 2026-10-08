/* Ocklu Herbal HP — 5 tab: Hari ini · Jelajah · Racik · Ngobrol · Ramuan.
   Semua hitungan takaran/menit/kecocokan dari data, AI cuma merapikan kata & menilai. */
const D = window.DATA || {tanaman:[],ramuan:[],indeks:{},kamus:{}};
const PETA = Object.fromEntries(D.tanaman.map(t => [t.slug, t]));
const E = s => document.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BK = {'tradisional':0,'studi awal':1,'bukti kuat':2};
const HARI = new Date().toISOString().slice(0,10);
const FOTO = window.FOTO_WEB||{};
const foto = p => p && (FOTO[p.slug] || '');

const T = {
 id:{sub:"Apotek hidup sedunia",jdl:"Apotek hidup sedunia",slg:"Tanaman obat dari seluruh dunia — nama latin, kandungan, takaran, menit masak, sampai jadi minuman siap minum.",
  nav:{hari:"Hari ini",jelajah:"Jelajah",peta:"Peta",racik:"Racik",ngobrol:"Ngobrol",ramuan:"Ramuan"},
  cari:"Cari nama, penyakit, kandungan…",semua:"Semua",tradisi:"Tradisi",iklim:"Iklim",
  s_tanaman:"tanaman",s_ramuan:"ramuan",s_keluhan:"keluhan",s_tradisi:"tradisi",
  nama:"Nama di dunia",isi:"Kandungan",guna:"Khasiat",olah:"Cara olah & menit",simpan:"Penyimpanan",
  plus:"Kelebihan",minus:"Kekurangan",baik:"Bagus dicampur",bahaya:"Bahaya dicampur",obat:"Dengan obat kimia",
  pantang:"Pantangan",tanam:"Cara menanam",sebar:"Tumbuh nyata di",ganti:"Pengganti lokal",tempat:"Iklim & tempat",
  hariJ:"Ramuan hari ini",hariT:"Tanaman hari ini",tema:"Tema hari ini",apotek:"Apotek hidup",
  apotekJ:"Tanaman yang menutup paling banyak keluhan di iklimmu — dihitung, bukan ditebak",
  racikJ:"Pilih bahan, saya yang menakar",pilih:"Pilih bahan",porsi:"Porsi (gelas)",
  takaran:"Takaran",tahap:"Tahap",air:"Air",jadi:"Jadi",prosedur:"Cara masak sampai siap minum",
  doa:"Boleh / lakukan",dont:"Jangan",cocok:"Cocok",hatiHati:"Hati-hati",jangan:"Jangan dicampur",
  periksa:"Minta worker periksa",simpanR:"Simpan",resepSaya:"Racikan saya",
  ngobrolJ:"Ceritakan sakitnya — worker akan balik bertanya",kirim:"Kirim",bawa:"Bawa ke Racik",
  buatHari:"Ramuan baru hari ini",buatHariJ:"Worker meracik satu ramuan baru khusus tema hari ini — ganti tiap hari",otak:"Otak Neutron",otakJ:"Inti peracik: membaca 284 tanaman, menakar sendiri, dan tahu kapan harus bilang tidak.",otakP:"Keluhan apa hari ini?",otakCek:"Memeriksa otak…",otakHidup:"Otak hidup",otakMati:"Otak mati",otakBuka:"Lihat yang baru & sedang ramai",tabBaru:"Yang baru",tabHype:"Sedang ramai",tabWabah:"Wabah & asap",hypeNaik:"Paling naik minggu ini",hypeTop:"Paling banyak dibuka orang",sumber:"Sumber",udara:"Udara sekarang",asapNasihat:"Udara kotor. Kurangi keluar rumah, pakai masker, minum banyak air. Herbal ini bisa membantu meredakan tenggorokan dan batuk — bukan pengganti masker:",sakitNaik:"Penyakit yang paling dicari orang minggu ini",whoJudul:"Laporan wabah WHO terbaru",hanyaDokter:"Penyakit ini harus ditangani dokter. Herbal hanya meringankan gejala.",baruTanaman:"Tanaman baru masuk",baruRamuan:"Ramuan baru",baruCatatan:"Tercatat masuk basis data:",fotoJ:"Kenali tanaman dari foto",fotoKirim:"[foto dikirim]",fotoBukan:"Ini sepertinya bukan tanaman.",fotoTidakBisa:"Tampilan ini tidak bisa mengirim foto.",premium:"Premium",perBulan:"per bulan",premAktif:"Premium aktif",premMati:"Matikan premium",bayarLewat:"Bayar lewat",kodeAktif:"Kode aktif",kodeIsi:"Masukkan kode",kodeSalah:"Kode salah",salin:"Salin",bayarBelum:"Pemilik belum mengisi cara bayar.",qrisCatatan:"Scan dari aplikasi bank/dompet mana pun yang mendukung QRIS.",kriptoCatatan:"Kirim tepat ke jaringan ini saja. Salah jaringan = dana hilang.",premJujur:"Halaman ini tidak memeriksa pembayaran sendiri — kode aktif diberikan pemilik setelah bayar.",prem1:"Racikan tersimpan tanpa batas",prem2:"Arsip ramuan harian (semua tanggal)",prem3:"Unduh data & cetak tanpa batas",prem4:"Peta lengkap + daftar negara",prem5:"Dukungan langsung ke pemilik",prem6:"Fitur baru duluan",petaCari:"Saring peta: keluhan, tradisi, nama…",petaKet:"Makin terang = makin banyak tanaman yang benar-benar tercatat tumbuh di sana",petaKosong:"Belum ada tanaman tercatat di sini untuk saringan ini.",sebar:"Sebarkan",sebarJ:"Bantu orang lain menemukannya",sebarCatatan:"Tautan ini cuma bisa dibuka orang yang kamu beri izin. Kalau mau terbuka untuk umum, pakai tombol Share di kanan atas halaman.",salinTautan:"Salin tautan",teksSiap:"Teks siap kirim",sebarPesan:"Apotek hidup sedunia: 284 tanaman obat, takaran dan cara masaknya, gratis dipakai. Bukan pengganti dokter.",disJudul:"Ini pendidikan, bukan pengobatan",disIsi:"Isi halaman ini untuk belajar dan mengenal tanaman obat. Tidak menjamin kesembuhan, tidak menggantikan pemeriksaan, diagnosis, resep, atau tindakan dokter. Untuk keluhan berat atau menetap, periksakan diri ke tenaga kesehatan.",disOke:"Saya mengerti",dapur:"Mode dapur",kosong:"Tidak ada yang cocok",jalan:"Sedang bekerja…",menit:"menit",
  b0:"turun-temurun",b1:"studi awal",b2:"bukti kuat",racun:"Beracun / keras",aHamil:"Hamil",aAnak:"Anak",
  bahan:"Bahan",dosis:"Dosis",hasil:"Hasil",lama:"Lama pakai",total:"Total",
  wajib:"Bukan pengganti dokter. Nyeri dada, sesak, perdarahan, demam >3 hari, kejang, bayi <2 tahun, atau keluhan memberat: langsung ke dokter.",
  aiMati:"Worker AI belum bisa dipakai di tampilan ini. Semua hitungan takaran, kecocokan, dan resep tetap jalan."},
 en:{sub:"World living pharmacy",jdl:"The world's living pharmacy",slg:"Medicinal plants from every continent — Latin names, compounds, doses, cooking minutes, to a finished drink.",
  nav:{hari:"Today",jelajah:"Explore",peta:"Map",racik:"Build",ngobrol:"Talk",ramuan:"Remedies"},
  cari:"Search name, ailment, compound…",semua:"All",tradisi:"Tradition",iklim:"Climate",
  s_tanaman:"plants",s_ramuan:"remedies",s_keluhan:"ailments",s_tradisi:"traditions",
  nama:"Names worldwide",isi:"Active compounds",guna:"Uses",olah:"Preparation & minutes",simpan:"Storage",
  plus:"Strengths",minus:"Drawbacks",baik:"Good combinations",bahaya:"Risky combinations",obat:"With medicines",
  pantang:"Contraindications",tanam:"How to grow",sebar:"Actually recorded in",ganti:"Local substitutes",tempat:"Climate & place",
  hariJ:"Today's remedy",hariT:"Plant of the day",tema:"Today's theme",apotek:"Home apothecary",
  apotekJ:"Plants covering the most complaints in your climate — computed, not guessed",
  racikJ:"Pick ingredients, I'll do the measuring",pilih:"Pick ingredients",porsi:"Servings (glasses)",
  takaran:"Amount",tahap:"Stage",air:"Water",jadi:"Yield",prosedur:"From pot to finished drink",
  doa:"Do",dont:"Don't",cocok:"Fits",hatiHati:"Careful",jangan:"Don't combine",
  periksa:"Ask the worker to check",simpanR:"Save",resepSaya:"My formulas",
  ngobrolJ:"Describe the illness — the worker will ask back",kirim:"Send",bawa:"Send to Build",
  buatHari:"Today's fresh formula",buatHariJ:"The worker composes a new remedy for today's theme — changes daily",otak:"Neutron Core",otakJ:"The formulating core: reads 284 plants, measures on its own, and knows when to say no.",otakP:"What's bothering you today?",otakCek:"Checking the core…",otakHidup:"Core online",otakMati:"Core offline",otakBuka:"See what's new & trending",tabBaru:"New",tabHype:"Trending",tabWabah:"Outbreaks & haze",hypeNaik:"Biggest risers this week",hypeTop:"Most looked up",sumber:"Source",udara:"Air right now",asapNasihat:"The air is bad. Stay in, wear a mask, drink plenty. These herbs may soothe throat and cough — they do not replace a mask:",sakitNaik:"Diseases people are looking up most this week",whoJudul:"Latest WHO outbreak reports",hanyaDokter:"This needs a doctor. Herbs only ease symptoms.",baruTanaman:"Newly added plants",baruRamuan:"New remedies",baruCatatan:"First recorded in the database:",fotoJ:"Identify a plant from a photo",fotoKirim:"[photo sent]",fotoBukan:"This doesn't look like a plant.",fotoTidakBisa:"This view can't send photos.",premium:"Premium",perBulan:"per month",premAktif:"Premium active",premMati:"Turn off premium",bayarLewat:"Pay with",kodeAktif:"Activation code",kodeIsi:"Enter code",kodeSalah:"Wrong code",salin:"Copy",bayarBelum:"The owner hasn't set up payment yet.",qrisCatatan:"Scan from any bank or wallet app that supports QRIS.",kriptoCatatan:"Send only on this network. Wrong network = lost funds.",premJujur:"This page does not verify payments itself — the owner sends the code after payment.",prem1:"Unlimited saved formulas",prem2:"Daily remedy archive (all dates)",prem3:"Unlimited export & print",prem4:"Full map + country lists",prem5:"Direct support from the owner",prem6:"New features first",petaCari:"Filter map: ailment, tradition, name…",petaKet:"Brighter = more plants actually recorded growing there",petaKosong:"No plants recorded here for this filter.",sebar:"Share",sebarJ:"Help others find it",sebarCatatan:"This link only opens for people you allow. To make it public, use the Share button at the top right of the page.",salinTautan:"Copy link",teksSiap:"Ready-to-send text",sebarPesan:"The world's living pharmacy: 284 medicinal plants with doses and how to prepare them, free to use. Not a substitute for a doctor.",disJudul:"Education, not treatment",disIsi:"This page exists to teach and to help you recognise medicinal plants. It does not guarantee any cure and does not replace examination, diagnosis, prescription or treatment by a clinician. For severe or lasting symptoms, see a health professional.",disOke:"I understand",dapur:"Kitchen mode",kosong:"Nothing matches",jalan:"Working…",menit:"min",
  b0:"traditional",b1:"early studies",b2:"strong evidence",racun:"Toxic / potent",aHamil:"Pregnancy",aAnak:"Children",
  bahan:"Ingredients",dosis:"Dose",hasil:"Yield",lama:"Duration",total:"Total",
  wajib:"Not a substitute for a doctor. Chest pain, breathlessness, bleeding, fever >3 days, seizures, infants <2y, or worsening symptoms: seek medical care.",
  aiMati:"The AI worker isn't available in this view. Measuring, compatibility and recipes still work."},
 zh:{sub:"世界活药房",jdl:"世界活药房",slg:"来自世界各地的药用植物——学名、成分、用量、煎煮分钟，直到可以喝的成品。",
  nav:{hari:"今天",jelajah:"浏览",peta:"地图",racik:"配制",ngobrol:"问诊",ramuan:"方剂"},
  cari:"搜索名称、病症、成分…",semua:"全部",tradisi:"传统",iklim:"气候",
  s_tanaman:"种植物",s_ramuan:"个方剂",s_keluhan:"种病症",s_tradisi:"个传统",
  nama:"世界各地名称",isi:"有效成分",guna:"功效",olah:"制法与分钟",simpan:"储存",
  plus:"优点",minus:"缺点",baik:"宜配伍",bahaya:"忌配伍",obat:"与西药",
  pantang:"禁忌",tanam:"种植方法",sebar:"实际分布",ganti:"本地替代",tempat:"气候与环境",
  hariJ:"今日方",hariT:"今日植物",tema:"今日主题",apotek:"家庭药园",
  apotekJ:"在你的气候下覆盖病症最多的植物——计算得出",
  racikJ:"选材料，我来称量",pilih:"选材料",porsi:"份量（杯）",
  takaran:"用量",tahap:"阶段",air:"水",jadi:"成品",prosedur:"从下锅到可以喝",
  doa:"要做",dont:"不要",cocok:"相配",hatiHati:"小心",jangan:"不可同用",
  periksa:"请工人复核",simpanR:"保存",resepSaya:"我的配方",
  ngobrolJ:"说说病情——工人会反问你",kirim:"发送",bawa:"送去配制",
  buatHari:"今日新方",buatHariJ:"工人按今日主题现配一剂——每天不同",otak:"中子核心",otakJ:"配方核心：读取284种植物，自行称量，也知道何时该拒绝。",otakP:"今天哪里不舒服？",otakCek:"正在检查核心…",otakHidup:"核心在线",otakMati:"核心离线",otakBuka:"看看新增与热门",tabBaru:"新增",tabHype:"热门",tabWabah:"疫情与烟霾",hypeNaik:"本周涨幅最大",hypeTop:"查看最多",sumber:"来源",udara:"当前空气",asapNasihat:"空气很差。减少外出、戴口罩、多喝水。这些草药可缓解咽喉与咳嗽，但不能代替口罩：",sakitNaik:"本周被查得最多的疾病",whoJudul:"世卫组织最新疫情通报",hanyaDokter:"此病必须就医，草药只能缓解症状。",baruTanaman:"新收录植物",baruRamuan:"新方剂",baruCatatan:"首次收录日期：",fotoJ:"用照片识别植物",fotoKirim:"［已发送照片］",fotoBukan:"这看起来不是植物。",fotoTidakBisa:"此视图无法发送照片。",premium:"会员",perBulan:"每月",premAktif:"会员已开通",premMati:"关闭会员",bayarLewat:"支付方式",kodeAktif:"激活码",kodeIsi:"输入激活码",kodeSalah:"激活码错误",salin:"复制",bayarBelum:"店主尚未设置支付方式。",qrisCatatan:"用支持QRIS的银行或钱包应用扫描。",kriptoCatatan:"只能通过此网络转账，选错网络资金将丢失。",premJujur:"本页不自行验证付款——付款后由店主发送激活码。",prem1:"无限保存配方",prem2:"每日方剂全部存档",prem3:"无限导出与打印",prem4:"完整地图与国家列表",prem5:"店主直接支持",prem6:"新功能优先体验",petaCari:"筛选地图：病症、传统、名称…",petaKet:"越亮＝当地实际记录的植物越多",petaKosong:"此筛选下该地暂无记录。",sebar:"分享",sebarJ:"帮别人找到它",sebarCatatan:"此链接只对你允许的人开放。若要公开，请用页面右上角的分享按钮。",salinTautan:"复制链接",teksSiap:"可直接发送的文案",sebarPesan:"世界活药房：284种药用植物，含用量与制法，免费使用。不能替代医生。",disJudul:"这是科普，不是治疗",disIsi:"本页用于学习与认识药用植物，不保证治愈，也不能替代医生的检查、诊断、处方或治疗。症状严重或持续，请就医。",disOke:"我明白",dapur:"厨房模式",kosong:"没有匹配",jalan:"处理中…",menit:"分钟",
  b0:"民间传承",b1:"初步研究",b2:"证据充分",racun:"有毒/峻烈",aHamil:"孕期",aAnak:"儿童",
  bahan:"用料",dosis:"用量",hasil:"成品",lama:"疗程",total:"合计",
  wajib:"不能替代医生。胸痛、呼吸困难、出血、发热超过3天、抽搐、2岁以下婴儿或症状加重请立即就医。",
  aiMati:"此视图暂不能使用AI工人。称量、配伍检查与方剂仍可使用。"},
 ja:{sub:"世界の生きた薬局",jdl:"世界の生きた薬局",slg:"世界中の薬用植物——学名、成分、分量、煎じ分数、飲める状態まで。",
  nav:{hari:"今日",jelajah:"探す",peta:"地図",racik:"調合",ngobrol:"相談",ramuan:"処方"},
  cari:"名前・症状・成分で検索…",semua:"すべて",tradisi:"伝統",iklim:"気候",
  s_tanaman:"種",s_ramuan:"処方",s_keluhan:"症状",s_tradisi:"伝統",
  nama:"世界の呼び名",isi:"有効成分",guna:"効能",olah:"作り方と分数",simpan:"保存",
  plus:"長所",minus:"短所",baik:"相性が良い",bahaya:"危険な組合せ",obat:"医薬品との相互作用",
  pantang:"禁忌",tanam:"育て方",sebar:"実際の分布",ganti:"身近な代替",tempat:"気候と環境",
  hariJ:"今日の一服",hariT:"今日の薬草",tema:"今日のテーマ",apotek:"家庭の薬草棚",
  apotekJ:"あなたの気候で不調を最も広くカバーする植物——計算による",
  racikJ:"材料を選べば分量は私が",pilih:"材料を選ぶ",porsi:"杯数",
  takaran:"分量",tahap:"段階",air:"水",jadi:"できあがり",prosedur:"鍋から飲めるまで",
  doa:"する",dont:"しない",cocok:"相性よし",hatiHati:"注意",jangan:"併用不可",
  periksa:"ワーカーに点検を頼む",simpanR:"保存",resepSaya:"私の処方",
  ngobrolJ:"症状を話してください——ワーカーが聞き返します",kirim:"送信",bawa:"調合へ",
  buatHari:"今日の新しい一服",buatHariJ:"ワーカーが今日のテーマで新しく調合——毎日変わります",otak:"ニュートロン・コア",otakJ:"調合の中枢：284種を読み、自分で計量し、断るべき時も分かります。",otakP:"今日はどこが不調ですか？",otakCek:"コアを確認中…",otakHidup:"コア稼働中",otakMati:"コア停止",otakBuka:"新着と話題を見る",tabBaru:"新着",tabHype:"話題",tabWabah:"流行と煙害",hypeNaik:"今週の伸び",hypeTop:"閲覧が多い順",sumber:"出典",udara:"今の空気",asapNasihat:"空気が悪い状態です。外出を控え、マスクを着け、水分を多めに。以下は喉と咳を和らげる助けですが、マスクの代わりにはなりません：",sakitNaik:"今週よく調べられている病気",whoJudul:"WHOの最新アウトブレイク情報",hanyaDokter:"これは受診が必要です。ハーブは症状を和らげるだけです。",baruTanaman:"新しく入った植物",baruRamuan:"新しい処方",baruCatatan:"データベース収録日：",fotoJ:"写真から植物を判定",fotoKirim:"［写真を送信］",fotoBukan:"これは植物ではなさそうです。",fotoTidakBisa:"この表示では写真を送れません。",premium:"プレミアム",perBulan:"月額",premAktif:"プレミアム有効",premMati:"プレミアムを解除",bayarLewat:"支払い方法",kodeAktif:"認証コード",kodeIsi:"コードを入力",kodeSalah:"コードが違います",salin:"コピー",bayarBelum:"オーナーが支払い方法を未設定です。",qrisCatatan:"QRIS対応の銀行・ウォレットアプリで読み取ってください。",kriptoCatatan:"このネットワークのみに送金してください。誤ると資金を失います。",premJujur:"このページは支払いを検証しません——支払い後にオーナーがコードを送ります。",prem1:"保存した処方が無制限",prem2:"日々の処方アーカイブ（全期間）",prem3:"書き出しと印刷が無制限",prem4:"地図と国別一覧のフル表示",prem5:"オーナーへの直接サポート",prem6:"新機能を先行利用",petaCari:"地図を絞り込み：症状・伝統・名前…",petaKet:"明るいほど、その国で実際に記録された植物が多い",petaKosong:"この絞り込みでは記録がありません。",sebar:"共有",sebarJ:"ほかの人にも届ける",sebarCatatan:"このリンクは許可した人だけが開けます。公開したい場合は右上の共有ボタンを使ってください。",salinTautan:"リンクをコピー",teksSiap:"そのまま送れる文章",sebarPesan:"世界の生きた薬局：284種の薬用植物、分量と作り方つき、無料。医師の代わりにはなりません。",disJudul:"教育であって治療ではありません",disIsi:"このページは学びと薬草を知るためのものです。治癒を保証せず、診察・診断・処方・治療の代わりにもなりません。重い症状や長引く症状は受診してください。",disOke:"わかりました",dapur:"キッチンモード",kosong:"該当なし",jalan:"処理中…",menit:"分",
  b0:"伝承",b1:"初期研究",b2:"強い根拠",racun:"有毒・劇性",aHamil:"妊娠",aAnak:"子ども",
  bahan:"材料",dosis:"用量",hasil:"できあがり",lama:"使用期間",total:"合計",
  wajib:"医師の代わりにはなりません。胸痛・呼吸困難・出血・3日以上の発熱・けいれん・2歳未満・悪化時はすぐ受診してください。",
  aiMati:"この表示ではAIワーカーを利用できません。分量計算・相性判定・処方は使えます。"},
 ko:{sub:"세계의 살아있는 약국",jdl:"세계의 살아있는 약국",slg:"세계 각지의 약용식물 — 학명, 성분, 용량, 달이는 분, 마실 수 있는 상태까지.",
  nav:{hari:"오늘",jelajah:"둘러보기",peta:"지도",racik:"조제",ngobrol:"상담",ramuan:"처방"},
  cari:"이름·증상·성분 검색…",semua:"전체",tradisi:"전통",iklim:"기후",
  s_tanaman:"종",s_ramuan:"처방",s_keluhan:"증상",s_tradisi:"전통",
  nama:"세계의 이름",isi:"유효성분",guna:"효능",olah:"조제법과 분",simpan:"보관",
  plus:"장점",minus:"단점",baik:"좋은 배합",bahaya:"위험한 배합",obat:"약물 상호작용",
  pantang:"금기",tanam:"재배법",sebar:"실제 분포",ganti:"현지 대체",tempat:"기후와 환경",
  hariJ:"오늘의 처방",hariT:"오늘의 약초",tema:"오늘의 주제",apotek:"우리집 약초밭",
  apotekJ:"당신의 기후에서 증상을 가장 많이 커버하는 식물 — 계산 결과",
  racikJ:"재료만 고르면 계량은 제가",pilih:"재료 고르기",porsi:"몇 잔",
  takaran:"용량",tahap:"단계",air:"물",jadi:"완성",prosedur:"냄비에서 마실 때까지",
  doa:"하세요",dont:"하지 마세요",cocok:"잘 맞음",hatiHati:"주의",jangan:"같이 쓰지 마세요",
  periksa:"워커에게 점검 요청",simpanR:"저장",resepSaya:"내 처방",
  ngobrolJ:"증상을 말해 주세요 — 워커가 되물어봅니다",kirim:"보내기",bawa:"조제로 보내기",
  buatHari:"오늘의 새 처방",buatHariJ:"워커가 오늘 주제로 새로 조제 — 매일 바뀝니다",otak:"중성자 코어",otakJ:"조제의 핵심: 284종을 읽고 스스로 계량하며, 거절할 때를 압니다.",otakP:"오늘 어디가 불편하세요?",otakCek:"코어 확인 중…",otakHidup:"코어 작동",otakMati:"코어 정지",otakBuka:"새로운 것과 화제 보기",tabBaru:"새로 추가",tabHype:"화제",tabWabah:"유행병·연무",hypeNaik:"이번 주 상승",hypeTop:"가장 많이 본 것",sumber:"출처",udara:"지금 공기",asapNasihat:"공기가 나쁩니다. 외출을 줄이고 마스크를 쓰고 물을 많이 드세요. 아래 약초는 목과 기침을 달래줄 뿐 마스크를 대신하지 않습니다:",sakitNaik:"이번 주 가장 많이 검색된 질병",whoJudul:"WHO 최신 발병 보고",hanyaDokter:"이 병은 병원 진료가 필요합니다. 약초는 증상 완화만 합니다.",baruTanaman:"새로 추가된 식물",baruRamuan:"새 처방",baruCatatan:"데이터베이스 등록일:",fotoJ:"사진으로 식물 식별",fotoKirim:"[사진 전송]",fotoBukan:"식물이 아닌 것 같습니다.",fotoTidakBisa:"이 화면에서는 사진을 보낼 수 없습니다.",premium:"프리미엄",perBulan:"월",premAktif:"프리미엄 활성",premMati:"프리미엄 끄기",bayarLewat:"결제 수단",kodeAktif:"활성 코드",kodeIsi:"코드 입력",kodeSalah:"코드가 틀립니다",salin:"복사",bayarBelum:"주인이 결제 수단을 아직 설정하지 않았습니다.",qrisCatatan:"QRIS를 지원하는 은행·지갑 앱으로 스캔하세요.",kriptoCatatan:"이 네트워크로만 보내세요. 잘못 보내면 자금을 잃습니다.",premJujur:"이 페이지는 결제를 직접 확인하지 않습니다 — 결제 후 주인이 코드를 보냅니다.",prem1:"저장 처방 무제한",prem2:"일일 처방 전체 보관함",prem3:"내보내기·인쇄 무제한",prem4:"전체 지도와 국가 목록",prem5:"주인의 직접 지원",prem6:"새 기능 우선 사용",petaCari:"지도 필터: 증상·전통·이름…",petaKet:"밝을수록 그 나라에서 실제로 기록된 식물이 많음",petaKosong:"이 필터로는 기록이 없습니다.",sebar:"공유",sebarJ:"다른 사람도 찾게 돕기",sebarCatatan:"이 링크는 허용한 사람만 열 수 있습니다. 공개하려면 오른쪽 위 공유 버튼을 쓰세요.",salinTautan:"링크 복사",teksSiap:"바로 보낼 수 있는 문구",sebarPesan:"세계의 살아있는 약국: 약용식물 284종, 용량과 조제법 포함, 무료. 의사를 대신하지 않습니다.",disJudul:"치료가 아니라 교육입니다",disIsi:"이 페이지는 배우고 약초를 알아보기 위한 것입니다. 완치를 보장하지 않으며 진찰·진단·처방·치료를 대신하지 않습니다. 증상이 심하거나 지속되면 진료받으세요.",disOke:"이해했습니다",dapur:"주방 모드",kosong:"일치 없음",jalan:"작업 중…",menit:"분",
  b0:"민간전승",b1:"초기 연구",b2:"강한 근거",racun:"독성/강함",aHamil:"임신",aAnak:"어린이",
  bahan:"재료",dosis:"용량",hasil:"분량",lama:"사용 기간",total:"합계",
  wajib:"의사를 대신할 수 없습니다. 흉통, 호흡곤란, 출혈, 3일 이상 발열, 경련, 2세 미만, 악화 시 즉시 진료받으세요.",
  aiMati:"이 화면에서는 AI 워커를 쓸 수 없습니다. 계량·배합 점검·처방은 작동합니다."},
 ru:{sub:"Живая аптека мира",jdl:"Живая аптека мира",slg:"Лекарственные растения со всего мира — латынь, вещества, дозы, минуты варки, до готового напитка.",
  nav:{hari:"Сегодня",jelajah:"Обзор",peta:"Карта",racik:"Сбор",ngobrol:"Разговор",ramuan:"Рецепты"},
  cari:"Поиск: название, болезнь, вещество…",semua:"Все",tradisi:"Традиция",iklim:"Климат",
  s_tanaman:"растений",s_ramuan:"рецептов",s_keluhan:"недомоганий",s_tradisi:"традиций",
  nama:"Названия в мире",isi:"Действующие вещества",guna:"Применение",olah:"Приготовление и минуты",simpan:"Хранение",
  plus:"Плюсы",minus:"Минусы",baik:"Хорошие сочетания",bahaya:"Опасные сочетания",obat:"С лекарствами",
  pantang:"Противопоказания",tanam:"Как выращивать",sebar:"Реально встречается",ganti:"Местные замены",tempat:"Климат и место",
  hariJ:"Сбор дня",hariT:"Растение дня",tema:"Тема дня",apotek:"Домашняя аптека",
  apotekJ:"Растения, закрывающие больше всего жалоб в вашем климате — расчёт",
  racikJ:"Выберите сырьё — отмерю я",pilih:"Выбрать сырьё",porsi:"Порции (стаканы)",
  takaran:"Доза",tahap:"Этап",air:"Вода",jadi:"Выход",prosedur:"От кастрюли до готового напитка",
  doa:"Делать",dont:"Не делать",cocok:"Сочетается",hatiHati:"Осторожно",jangan:"Не смешивать",
  periksa:"Попросить проверку",simpanR:"Сохранить",resepSaya:"Мои сборы",
  ngobrolJ:"Расскажите о болезни — работник переспросит",kirim:"Отправить",bawa:"В сбор",
  buatHari:"Новый сбор дня",buatHariJ:"Работник составляет новый сбор под тему дня — каждый день другой",otak:"Нейтронное ядро",otakJ:"Ядро сбора: читает 284 растения, само отмеряет и знает, когда сказать нет.",otakP:"Что беспокоит сегодня?",otakCek:"Проверяю ядро…",otakHidup:"Ядро работает",otakMati:"Ядро недоступно",otakBuka:"Что нового и на слуху",tabBaru:"Новое",tabHype:"На слуху",tabWabah:"Вспышки и дым",hypeNaik:"Наибольший рост за неделю",hypeTop:"Чаще всего смотрят",sumber:"Источник",udara:"Воздух сейчас",asapNasihat:"Воздух плохой. Меньше выходите, носите маску, пейте больше воды. Эти травы могут смягчить горло и кашель — но не заменяют маску:",sakitNaik:"Болезни, которые чаще всего ищут на этой неделе",whoJudul:"Последние сводки ВОЗ о вспышках",hanyaDokter:"Здесь нужен врач. Травы лишь облегчают симптомы.",baruTanaman:"Новые растения",baruRamuan:"Новые рецепты",baruCatatan:"Впервые в базе:",fotoJ:"Определить растение по фото",fotoKirim:"[фото отправлено]",fotoBukan:"Похоже, это не растение.",fotoTidakBisa:"В этом просмотре нельзя отправлять фото.",premium:"Премиум",perBulan:"в месяц",premAktif:"Премиум активен",premMati:"Выключить премиум",bayarLewat:"Оплата через",kodeAktif:"Код активации",kodeIsi:"Введите код",kodeSalah:"Неверный код",salin:"Копировать",bayarBelum:"Владелец ещё не настроил оплату.",qrisCatatan:"Отсканируйте в любом банке или кошельке с поддержкой QRIS.",kriptoCatatan:"Отправляйте только в этой сети. Ошибка — потеря средств.",premJujur:"Страница не проверяет оплату сама — код выдаёт владелец после оплаты.",prem1:"Неограниченные сохранённые сборы",prem2:"Архив сборов дня (все даты)",prem3:"Без ограничений на экспорт и печать",prem4:"Полная карта и списки стран",prem5:"Прямая поддержка владельца",prem6:"Новые функции раньше всех",petaCari:"Фильтр карты: жалоба, традиция, название…",petaKet:"Ярче — больше растений реально зафиксировано там",petaKosong:"По этому фильтру записей нет.",sebar:"Поделиться",sebarJ:"Помогите другим найти",sebarCatatan:"Эта ссылка открывается только тем, кому вы разрешили. Чтобы сделать её открытой, нажмите «Поделиться» вверху справа.",salinTautan:"Скопировать ссылку",teksSiap:"Готовый текст",sebarPesan:"Живая аптека мира: 284 лекарственных растения с дозами и способом приготовления, бесплатно. Не заменяет врача.",disJudul:"Это образование, а не лечение",disIsi:"Страница создана для обучения и распознавания лекарственных растений. Она не гарантирует излечения и не заменяет осмотр, диагноз, назначение или лечение у врача. При тяжёлых или затяжных симптомах обратитесь к врачу.",disOke:"Понятно",dapur:"Режим кухни",kosong:"Ничего не найдено",jalan:"Работаю…",menit:"мин",
  b0:"народная традиция",b1:"ранние исследования",b2:"веские данные",racun:"Ядовитое/сильное",aHamil:"Беременность",aAnak:"Дети",
  bahan:"Состав",dosis:"Доза",hasil:"Выход",lama:"Курс",total:"Всего",
  wajib:"Не заменяет врача. Боль в груди, одышка, кровотечение, лихорадка >3 дней, судороги, дети до 2 лет или ухудшение — к врачу.",
  aiMati:"ИИ-работник недоступен в этом просмотре. Расчёт доз, проверка сочетаний и рецепты работают."}
};
let L = (()=>{try{return localStorage.getItem('oh_bhs')||'id'}catch(e){return 'id'}})();
const t = k => k.split('.').reduce((a,b)=>a&&a[b],T[L]||T.id) || k;
const nm = p => p?((p.nama&&(p.nama[L]||p.nama.id||p.nama.en))||p.nama_id||p.binomial):'';
function tr(x){
  if(!x||L==='id')return x||'';
  const t1=String(x), low=t1.toLowerCase();
  const a=(D.kamus&&D.kamus[L])||{}; if(a[low])return a[low];
  const b=(D.istilah&&D.istilah[L])||{}; return b[low]||b[t1]||t1;
}
const bkt = b => `<span class="bukti b${BK[b]||0}"></span>${t('b'+(BK[b]||0))}`;
const simpan=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const muatLokal=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};

const TABS=['hari','jelajah','peta','racik','ngobrol','ramuan'];
let TAB=(TABS.includes((location.hash||'').replace('#',''))?location.hash.replace('#',''):'hari'), Q='', FIL={tradisi:'',iklim:''}, AI=null, AI_SIAP=false;
let BAHAN = muatLokal('oh_bahan',[]), PORSI = muatLokal('oh_porsi',2);
let OBROLAN = [];

/* ================= hitungan ================= */
const angka = s => { const m=String(s||'').replace(',','.').match(/(\d+(?:\.\d+)?)/); return m?parseFloat(m[1]):null };
function satuan(s){
  const m=String(s||'').toLowerCase().match(/(\d+(?:[.,]\d+)?)\s*(gram|g\b|ml|sdt|sdm|butir|lembar|batang|siung|buah|potong|cm|ruas|kuntum)/);
  if(!m)return null;
  let u=m[2].trim(); if(u==='g')u='g'; if(u==='gram')u='g';
  return {n:parseFloat(m[1].replace(',','.')), u};
}
function olahUtama(p){
  const list=p.olah||[]; if(!list.length)return null;
  return list.find(o=>/rebus|dekok|godok/i.test(o.metode||'')) || list.find(o=>/seduh|infus|teh/i.test(o.metode||'')) || list[0];
}
const KERAS=/rimpang|akar|kulit|batang|biji|umbi|kayu|buah kering|rhizom/i;
const LEMBUT=/daun|bunga|pucuk|herba|kelopak|tunas/i;
const AROMA=/cengkeh|kayu manis|kapulaga|adas|ketumbar|jintan|pala|serai|lada/i;
function tahapBahan(p){
  const bagian=(p.bagian_dipakai||[]).join(' ').toLowerCase();
  const nama=(nm(p)+' '+p.binomial).toLowerCase();
  if(AROMA.test(nama)) return 3;
  if(KERAS.test(bagian)) return 1;
  if(LEMBUT.test(bagian)) return 2;
  return 2;
}
function hitungRacikan(slugs, porsi){
  const bahan=[]; let menitKeras=0, menitLembut=0, menitAroma=0;
  for(const s of slugs){
    const p=PETA[s]; if(!p)continue;
    const o=olahUtama(p)||{};
    const b=satuan(o.bahan)||{n:5,u:'g',kira:true};
    const airBase=angka(o.air)||300;
    const hasilBase=angka(o.hasil)||Math.round(airBase*0.7);
    const gelasBase=Math.max(1,Math.round(hasilBase/200));
    const faktor=porsi/gelasBase;
    const menit=parseInt(o.menit)||10;
    const th=tahapBahan(p);
    if(th===1)menitKeras=Math.max(menitKeras,menit);
    else if(th===3)menitAroma=Math.max(menitAroma,Math.min(menit,5));
    else menitLembut=Math.max(menitLembut,Math.min(menit,10));
    bahan.push({slug:s,p,nama:nm(p),latin:p.binomial,foto:FOTO[s]||'',bagian:(p.bagian_dipakai||[]).join(', '),
      jumlah:Math.round(b.n*faktor*10)/10, satuan:b.u, kira:!!b.kira, tahap:th, menit, metode:o.metode||'-',
      dosis:o.dosis||'', tips:o.tips||'', suhu:o.suhu||'', airBase, gelasBase});
  }
  const menitRebus=menitKeras||menitLembut||menitAroma||10;
  const totalMasak=menitKeras+ (menitLembut?0:0);
  const air=Math.round(porsi*250 + 10*menitRebus);
  const uap=Math.round(10*menitRebus);
  const jadi=Math.max(porsi*180, air-uap);
  const menitTotal=(menitKeras||0)+(menitLembut? 0:0);
  const waktuTotal=5 + (menitKeras||menitLembut||menitAroma||10);
  // kecocokan
  const pasanganBaik=[], pasanganBahaya=[];
  for(let i=0;i<bahan.length;i++)for(let j=i+1;j<bahan.length;j++){
    const a=bahan[i].p,b=bahan[j].p;
    const cocokNama=(x,target)=>[x.binomial,nm(x),x.nama_id||'',x.nama_en||''].some(v=>v&&String(target).toLowerCase().includes(String(v).toLowerCase()));
    for(const c of (a.campur_baik||[])) if(cocokNama(b,c.dengan)) pasanganBaik.push({a:bahan[i].nama,b:bahan[j].nama,akibat:c.akibat});
    for(const c of (b.campur_baik||[])) if(cocokNama(a,c.dengan)) pasanganBaik.push({a:bahan[j].nama,b:bahan[i].nama,akibat:c.akibat});
    for(const c of (a.campur_bahaya||[])) if(cocokNama(b,c.dengan)) pasanganBahaya.push({a:bahan[i].nama,b:bahan[j].nama,akibat:c.akibat,tingkat:c.tingkat});
    for(const c of (b.campur_bahaya||[])) if(cocokNama(a,c.dengan)) pasanganBahaya.push({a:bahan[j].nama,b:bahan[i].nama,akibat:c.akibat,tingkat:c.tingkat});
  }
  let skor=0; pasanganBaik.forEach(()=>skor+=2);
  pasanganBahaya.forEach(x=>skor-= x.tingkat==='hindari'?8:3);
  const beracun=bahan.filter(b=>(b.p.racun||{}).status==='ya-berbahaya');
  if(beracun.length)skor-=20;
  const nilai = skor<=-8?'jangan' : skor<0?'hati-hati' : 'cocok';
  // keselamatan
  const urut={'aman':0,'hati-hati':1,'belum pasti':2,'hindari':3};
  const terburuk=(k)=>bahan.reduce((a,b)=>urut[b.p[k]]>urut[a]?b.p[k]:a,'aman');
  const pantangan=[...new Set(bahan.flatMap(b=>(b.p.pantangan||[]).map(x=>`${b.nama}: ${x}`)))];
  const obatKimia=bahan.flatMap(b=>(b.p.obat_kimia||[]).map(o=>({bahan:b.nama,...o})));
  const simpanLama=bahan.map(b=>(b.p.simpan||{}).lama).filter(Boolean);
  const bukti=bahan.map(b=>(b.p.khasiat||[]).reduce((a,k)=>Math.max(a,BK[k.bukti]||0),0));
  const buktiRata=bukti.length?Math.round(bukti.reduce((a,b)=>a+b,0)/bukti.length):0;
  // prosedur
  const langkah=[];
  let no=1;
  langkah.push({no:no++,kerja:L==='id'?`Cuci semua bahan, iris tipis yang keras (${bahan.filter(b=>b.tahap===1).map(b=>b.nama).join(', ')||'-'})`:`Wash everything; slice the hard parts thin`,menit:5});
  langkah.push({no:no++,kerja:L==='id'?`Didihkan ${air} ml air di panci kaca/stainless (jangan panci besi/aluminium)`:`Bring ${air} ml water to a boil in a glass or stainless pot`,menit:3,suhu:'100 °C'});
  const t1=bahan.filter(b=>b.tahap===1), t2=bahan.filter(b=>b.tahap===2), t3=bahan.filter(b=>b.tahap===3);
  if(t1.length)langkah.push({no:no++,kerja:(L==='id'?'Masukkan ':'Add ')+t1.map(b=>`${b.nama} ${b.jumlah} ${b.satuan}`).join(', ')+(L==='id'?`, kecilkan api, rebus tertutup`:`, lower the heat, simmer covered`),menit:menitKeras||15,suhu:'95-100 °C'});
  if(t2.length)langkah.push({no:no++,kerja:(L==='id'?'Masukkan ':'Add ')+t2.map(b=>`${b.nama} ${b.jumlah} ${b.satuan}`).join(', ')+(L==='id'?` di ${menitLembut||8} menit terakhir, api kecil`:` for the last ${menitLembut||8} minutes`),menit:menitLembut||8,suhu:'85-95 °C'});
  if(t3.length)langkah.push({no:no++,kerja:(L==='id'?'Masukkan ':'Add ')+t3.map(b=>`${b.nama} ${b.jumlah} ${b.satuan}`).join(', ')+(L==='id'?` di ${menitAroma||4} menit terakhir supaya minyak harumnya tidak hilang`:` in the last ${menitAroma||4} minutes`),menit:menitAroma||4,suhu:'80-90 °C'});
  langkah.push({no:no++,kerja:L==='id'?`Matikan api, tutup, diamkan supaya sari keluar`:`Turn off the heat, cover and let it steep`,menit:10});
  langkah.push({no:no++,kerja:L==='id'?`Saring dengan kain/saringan halus — target ${jadi} ml (±${porsi} gelas)`:`Strain through fine cloth — target ${jadi} ml (~${porsi} glasses)`,menit:3});
  langkah.push({no:no++,kerja:L==='id'?`Cicipi: kalau terlalu pahit tambah madu/gula aren setelah agak hangat (jangan saat mendidih)`:`Taste: sweeten with honey once it has cooled a little`,menit:2});
  langkah.push({no:no++,kerja:L==='id'?`Tuang ke botol kaca steril, tempel tanggal ${HARI}. Simpan di kulkas${simpanLama.length?' — ikuti yang paling pendek: '+simpanLama[0]:''}`:`Pour into a sterile glass bottle, label ${HARI}, keep refrigerated`,menit:5});
  const boleh=[...new Set([
    ...bahan.filter(b=>b.tips).map(b=>`${b.nama}: ${b.tips}`),
    L==='id'?'Pakai panci kaca, tanah liat, atau stainless':'Use glass, clay or stainless steel',
    L==='id'?'Minum hangat, sesudah makan, mulai setengah dosis di hari pertama':'Drink warm, after food; start at half dose on day one',
    L==='id'?'Buat sedikit-sedikit; ramuan segar lebih baik daripada disimpan lama':'Make small batches; fresh beats stored'])];
  const jangan=[...new Set([
    L==='id'?'Jangan pakai panci besi/aluminium (zatnya bereaksi dengan tanin)':'No iron or aluminium pots (they react with tannins)',
    L==='id'?'Jangan direbus sampai gosong atau airnya habis':'Never boil dry',
    L==='id'?'Jangan dicampur obat dokter tanpa tanya apoteker':'Do not mix with prescription drugs without asking a pharmacist',
    ...pasanganBahaya.map(x=>`${x.a} + ${x.b}: ${x.akibat}`),
    ...beracun.map(b=>`${b.nama}: ${L==='id'?'tanaman keras — jangan diracik sendiri':'potent plant — not for home formulation'}`)])];
  return {bahan,air,uap,jadi,porsi,waktuTotal,menitKeras,menitLembut,menitAroma,langkah,
    pasanganBaik,pasanganBahaya,nilai,skor,beracun,
    hamil:terburuk('aman_hamil'),anak:terburuk('aman_anak'),pantangan,obatKimia,
    simpanLama:simpanLama[0]||'',bukti:buktiRata};
}
function kandidat(keluhan, batas=40){
  const teks=(keluhan||'').toLowerCase();
  const kata=teks.split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>3);
  const skor=[];
  for(const p of D.tanaman){
    let s=0;
    const blob=JSON.stringify(p.khasiat||[]).toLowerCase();
    const nblob=(JSON.stringify(p.nama||{})+JSON.stringify(p.nama_lain||[])).toLowerCase();
    for(const w of kata){ if(blob.includes(w))s+=3; if(nblob.includes(w))s+=2 }
    for(const k of (p.khasiat||[])){
      const asli=(k.keluhan||'').toLowerCase();
      for(const b of ['en','zh','ja','ko','ru']){
        const v=((D.kamus[b]||{})[asli]||'').toLowerCase();
        if(v.length>2 && (teks.includes(v)||kata.some(w=>v.includes(w)))) s+=4;
      }
    }
    if(s){ s += (p.khasiat||[]).some(k=>k.bukti==='bukti kuat')?2:0; skor.push([s,p]) }
  }
  skor.sort((a,b)=>b[0]-a[0]);
  return skor.slice(0,batas).map(x=>x[1]);
}
function apotekHidup(iklim,jumlah){
  const bobot={'bukti kuat':3,'studi awal':2,'tradisional':1};
  const calon=[];
  for(const p of D.tanaman){
    if(iklim && !(p.iklim||[]).map(x=>String(x).toLowerCase()).includes(iklim)) continue;
    if((p.racun||{}).status==='ya-berbahaya') continue;
    const g={};
    for(const k of (p.khasiat||[])){const n=(k.keluhan||'').trim().toLowerCase(); if(n)g[n]=Math.max(g[n]||0,bobot[k.bukti]||1)}
    if(Object.keys(g).length)calon.push([p,g]);
  }
  const sering={}; calon.forEach(([,g])=>Object.keys(g).forEach(n=>sering[n]=(sering[n]||0)+1));
  const dipilih=new Set(), tertutup=new Set(), hasil=[];
  for(let i=0;i<Math.min(jumlah,calon.length);i++){
    let terbaik=null,skorT=-1,baruT=[];
    for(const [p,g] of calon){
      if(dipilih.has(p.slug))continue;
      const baru=Object.keys(g).filter(n=>!tertutup.has(n));
      const skor=baru.reduce((a,n)=>a+g[n]*(1+Math.min(sering[n]||1,6)/6),0);
      if(skor>skorT){terbaik=p;skorT=skor;baruT=baru}
    }
    if(!terbaik||skorT<=0)break;
    dipilih.add(terbaik.slug); baruT.forEach(n=>tertutup.add(n));
    hasil.push({p:terbaik,baru:baruT});
  }
  return {hasil,tertutup:tertutup.size,calon:calon.length};
}
function kembar(slug,iklim,batas=5){
  const a=PETA[slug]; if(!a)return [];
  const bersih=s=>String(s||'').replace(/\(.*?\)/g,'').trim().toLowerCase();
  const ka=new Set((a.kandungan||[]).map(k=>bersih(k.nama)));
  const kha=new Set((a.khasiat||[]).map(k=>bersih(k.keluhan)));
  const out=[];
  for(const p of D.tanaman){
    if(p.slug===slug)continue;
    if(iklim && !(p.iklim||[]).map(x=>String(x).toLowerCase()).includes(iklim))continue;
    const kb=new Set((p.kandungan||[]).map(k=>bersih(k.nama)));
    const khb=new Set((p.khasiat||[]).map(k=>bersih(k.keluhan)));
    const irisI=[...ka].filter(x=>kb.has(x)), irisG=[...kha].filter(x=>khb.has(x));
    const skor=0.45*(irisI.length/Math.max(1,new Set([...ka,...kb]).size))+0.55*(irisG.length/Math.max(1,new Set([...kha,...khb]).size));
    if(skor>0)out.push({p,skor,guna:irisG.slice(0,3)});
  }
  out.sort((x,y)=>y.skor-x.skor);
  return out.slice(0,batas);
}
/* pilihan harian: sama untuk semua orang di tanggal yang sama, ganti tiap hari */
function benihHari(s){let h=0;for(const c of (HARI+s))h=(h*31+c.charCodeAt(0))>>>0;return h}
function hariIni(){
  const aman=D.tanaman.filter(p=>(p.racun||{}).status!=='ya-berbahaya');
  const tanaman=aman[benihHari('t')%aman.length];
  const buatanHariIni=D.ramuan.find(r=>r.tanggal===HARI);   // racikan yang dibuat worker pagi ini
  const ramuan=buatanHariIni || (D.ramuan.length?D.ramuan[benihHari('r')%D.ramuan.length]:null);
  const tema=Object.entries(D.indeks.keluhan||{}).sort((a,b)=>b[1].length-a[1].length).slice(0,24);
  const pilihTema=tema.length?tema[benihHari('k')%tema.length]:null;
  return {tanaman,ramuan,baru:!!buatanHariIni,tema:pilihTema?pilihTema[0]:'',temaSlug:pilihTema?pilihTema[1]:[]};
}

/* ================= tampilan ================= */
function gambarUlang(){
  document.documentElement.lang=L;
  E('#sub').textContent=t('sub'); E('#jdl').textContent=t('jdl'); E('#slg').textContent=t('slg');
  const keluhan=Object.keys(D.indeks.keluhan||{}).length, trad=Object.keys(D.indeks.tradisi||{}).length;
  E('#angka').innerHTML=[[D.tanaman.length,t('s_tanaman'),'tanaman'],[D.ramuan.length,t('s_ramuan'),'ramuan'],
    [keluhan,t('s_keluhan'),'keluhan'],[trad,t('s_tradisi'),'tradisi']]
    .map(([a,b,aksi])=>`<div role="button" tabindex="0" data-aksi="${aksi}"><b>${a}</b><span>${esc(b)}</span></div>`).join('');
  E('#angka').onclick=e=>{const d=e.target.closest('[data-aksi]'); if(d)jalankanAksi(d.dataset.aksi)};
  E('#angka').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const d=e.target.closest('[data-aksi]');if(d){e.preventDefault();jalankanAksi(d.dataset.aksi)}}};
  const ikon={hari:'🌅',jelajah:'🌿',peta:'🗺️',racik:'⚗️',ngobrol:'💬',ramuan:'📜'};
  E('#nav').innerHTML=Object.keys(ikon).map(k=>
    `<button type="button" class="${TAB===k?'on':''}" data-tab="${k}"><b>${ikon[k]}</b>${esc(t('nav.'+k))}</button>`).join('');
  E('#navAtas').innerHTML=Object.keys(ikon).map(k=>
    `<button type="button" class="${TAB===k?'on':''}" data-tab="${k}">${ikon[k]} ${esc(t('nav.'+k))}</button>`).join('');
  ({hari:vHari,jelajah:vJelajah,peta:vPeta,racik:vRacik,ngobrol:vNgobrol,ramuan:vRamuan}[TAB])();
}
const klikTab=e=>{const b=e.target.closest('button[data-tab]');if(b){keTab(b.dataset.tab)}};
E('#nav').onclick=klikTab;
E('#navAtas').onclick=klikTab;
function keTab(k){TAB=k;try{history.replaceState(null,'','#'+k)}catch(e){};gambarUlang();window.scrollTo({top:0,behavior:'smooth'})}
window.addEventListener('hashchange',()=>{const k=(location.hash||'').replace('#','');if(TABS.includes(k)&&k!==TAB){TAB=k;gambarUlang()}});
E('#bhs').addEventListener('change',e=>{L=e.target.value;try{localStorage.setItem('oh_bhs',L)}catch(x){};gambarUlang()});

function kartu(p){
  const guna=(p.khasiat||[]).slice(0,2).map(k=>tr(k.keluhan)).join(' · ');
  const racun=(p.racun||{}).status==='ya-berbahaya';
  return `<button type="button" class="kartu" data-slug="${p.slug}">
    <div class="gbr">${foto(p)?`<img loading="lazy" src="${foto(p)}" alt="">`:`<div class="mono">${esc((p.binomial||'?')[0])}</div>`}
      ${racun?'<span class="pojok">☠</span>':''}</div>
    <div class="teks"><h3>${esc(nm(p))}</h3><div class="lat">${esc(p.binomial)}</div>
      <div class="guna">${esc(guna)}</div></div></button>`;
}
function jalankanAksi(a){
  if(a==='tanaman'){Q='';FIL={tradisi:'',iklim:''};keTab('jelajah');return}
  if(a==='ramuan'){keTab('ramuan');return}
  if(a==='keluhan')return daftarKeluhan();
  if(a==='tradisi')return daftarTradisi();
}
function daftarKeluhan(){
  const semua=Object.entries(D.indeks.keluhan||{}).sort((a,b)=>b[1].length-a[1].length);
  const label=k=>L==='id'?k:((D.kamus[L]||{})[k]||k);
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button>
     <b>${esc(t('s_keluhan'))} · ${semua.length}</b><span></span></div>
   <section class="blok" style="border:0">
     <div class="cari"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
       <input id="cariKeluhan" placeholder="${esc(t('cari'))}"></div>
     <div class="daftarpanjang" id="daftarK"></div></section>`;
  const isi=()=>{
    const q=(E('#cariKeluhan').value||'').toLowerCase();
    const pilih=semua.filter(([k])=>!q||k.includes(q)||label(k).toLowerCase().includes(q)).slice(0,400);
    E('#daftarK').innerHTML=pilih.map(([k,v])=>
      `<button type="button" class="barisklik" data-keluhan="${esc(k)}"><span>${esc(label(k))}</span><b>${v.length}</b></button>`).join('')
      ||`<div class="kosong">${esc(t('kosong'))}</div>`;
  };
  E('#cariKeluhan').oninput=isi; isi();
  E('#daftarK').onclick=e=>{const b=e.target.closest('[data-keluhan]');
    if(b){Q=b.dataset.keluhan;FIL={tradisi:'',iklim:''};tutup();keTab('jelajah')}};
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}
function daftarTradisi(){
  const semua=Object.entries(D.indeks.tradisi||{}).sort((a,b)=>b[1].length-a[1].length);
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button>
     <b>${esc(t('s_tradisi'))} · ${semua.length}</b><span></span></div>
   <section class="blok" style="border:0">
     <div class="cari"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
       <input id="cariTradisi" placeholder="${esc(t('cari'))}"></div>
     <div class="daftarpanjang" id="daftarT"></div></section>`;
  const isi=()=>{
    const q=(E('#cariTradisi').value||'').toLowerCase();
    const pilih=semua.filter(([k])=>!q||k.toLowerCase().includes(q)).slice(0,400);
    E('#daftarT').innerHTML=pilih.map(([k,v])=>
      `<button type="button" class="barisklik" data-tradisi="${esc(k)}"><span>${esc(k)}</span><b>${v.length}</b></button>`).join('')
      ||`<div class="kosong">${esc(t('kosong'))}</div>`;
  };
  E('#cariTradisi').oninput=isi; isi();
  E('#daftarT').onclick=e=>{const b=e.target.closest('[data-tradisi]');
    if(b){Q='';FIL={tradisi:b.dataset.tradisi,iklim:''};tutup();keTab('jelajah')}};
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}

/* ---- Hari ini ---- */
function vHari(){
  const h=hariIni();
  const r=h.ramuan;
  const apotek=apotekHidup('tropis',6);
  const topKeluhan=Object.entries(D.indeks.keluhan||{}).sort((a,b)=>b[1].length-a[1].length).slice(0,10);
  const topTradisi=Object.entries(D.indeks.tradisi||{}).sort((a,b)=>b[1].length-a[1].length).slice(0,8);
  const label=k=>L==='id'?k:((D.kamus[L]||{})[k]||k);
  E('#isi').innerHTML=`
  <div class="tiga">
    <!-- kiri -->
    <div class="kolom kiri">
      <div class="kotak">
        <div class="judulkol">${esc(t('s_keluhan'))}</div>
        <div class="daftarpanjang" style="max-height:none">
          ${topKeluhan.map(([k,v])=>`<button type="button" class="barisklik" data-keluhan="${esc(k)}"><span>${esc(label(k))}</span><b>${v.length}</b></button>`).join('')}
        </div>
        <button type="button" class="btn" style="width:100%;margin-top:8px" data-aksi="keluhan">${esc(t('semua'))} →</button>
      </div>
      <div class="kotak">
        <div class="judulkol">${esc(t('s_tradisi'))}</div>
        <div class="chips" style="margin:0">
          ${topTradisi.map(([k,v])=>`<button type="button" class="chip" data-tradisi="${esc(k)}">${esc(k)} <b style="opacity:.55">${v.length}</b></button>`).join('')}
        </div>
        <button type="button" class="btn" style="width:100%;margin-top:8px" data-aksi="tradisi">${esc(t('semua'))} →</button>
      </div>
    </div>

    <!-- tengah: otak neutron -->
    <div class="kolom tengah">
      <button type="button" class="neutron" id="tombolOtak" aria-label="${esc(t('otakBuka'))}">
        <canvas class="inti" id="intiNeutron"></canvas>
        <div class="keterangan">
          <div class="nadi"><i id="nadiOtak"></i><span id="statusOtak">${esc(t('otakCek'))}</span></div>
          <div style="font-family:var(--serif);font-size:19px;margin-top:2px">${esc(t('otak'))}</div>
          <div class="mini">${esc(t('otakJ'))}</div>
          <div class="tag j" style="margin-top:6px">${esc(t('otakBuka'))} →</div>
        </div>
      </button>
      <div class="kotak" style="padding:0;overflow:hidden">
        <div class="tanyacepat">
          <input id="tanyaCepat" placeholder="${esc(t('otakP'))}" enterkeyhint="send">
          <button type="button" class="btn utama" id="btnCepat">→</button>
        </div>
        <div id="jawabCepat"></div>
      </div>
      <div class="kotak" id="kotakBuat">
        <b>✨ ${esc(t('buatHari'))}</b>
        <div class="mini" style="margin:3px 0 9px">${esc(t('buatHariJ'))}</div>
        <div id="isiBuat"></div>
        <button type="button" class="btn utama" id="btnBuat" style="width:100%">⚗️ ${esc(t('buatHari'))}</button></div>
    </div>

    <!-- kanan -->
    <div class="kolom kanan">
      <div class="kotak" style="padding:0;overflow:hidden">
        <div style="padding:12px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div><div class="mini">${esc(t('tema'))}</div>
            <b style="font-family:var(--serif);font-size:17px">${esc(h.ramuan&&h.ramuan.tema?h.ramuan.tema:(h.tema||'-'))}</b></div>
          <span class="tag g">${HARI}</span></div>
        ${r?`<button type="button" class="kartu lebar" data-ramuan="${D.ramuan.indexOf(r)}">
          <div class="gbr">${fotoRamuan(r)?`<img src="${fotoRamuan(r)}" alt="">`:`<div class="mono">📜</div>`}</div>
          <div class="teks"><div class="mini">${esc(t('hariJ'))}${h.baru?' · '+(L==='id'?'baru pagi ini':'made today'):''}</div>
            <h3>${esc(r['nama_'+L]||r.nama_id||r.nama_en)}</h3>
            <div class="lat">${esc((r.bahan||[]).slice(0,3).map(b=>b.tanaman).join(' · '))}</div>
            <div class="guna">${esc((r.untuk||[]).join(' · '))}</div>
            <span class="tag">⏱ ${esc(r.total_menit||'?')} ${esc(t('menit'))}</span></div></button>`:''}
        <button type="button" class="kartu lebar" data-slug="${h.tanaman.slug}">
          <div class="gbr">${foto(h.tanaman)?`<img src="${foto(h.tanaman)}" alt="">`:`<div class="mono">${esc(h.tanaman.binomial[0])}</div>`}</div>
          <div class="teks"><div class="mini">${esc(t('hariT'))}</div>
            <h3>${esc(nm(h.tanaman))}</h3><div class="lat">${esc(h.tanaman.binomial)}</div>
            <div class="guna">${esc((h.tanaman.khasiat||[]).slice(0,2).map(k=>k.keluhan).join(' · '))}</div></div></button>
      </div>
      <div class="kotak">
        <div class="judulkol">🏡 ${esc(t('apotek'))}</div>
        <div class="mini" style="margin-bottom:9px">${esc(t('apotekJ'))}</div>
        <div class="kisi">${apotek.hasil.map(x=>kartu(x.p)).join('')}</div></div>
      <div class="kotak awas" style="font-size:12.5px">${esc(t('wajib'))}</div>
    </div>
  </div>`;

  // klik daftar kiri
  E('#isi').onclick=e=>{
    const k=e.target.closest('[data-keluhan]');
    if(k){Q=k.dataset.keluhan;FIL={tradisi:'',iklim:''};keTab('jelajah');return}
    const tr=e.target.closest('[data-tradisi]');
    if(tr){Q='';FIL={tradisi:tr.dataset.tradisi,iklim:''};keTab('jelajah');return}
    const a=e.target.closest('[data-aksi]');
    if(a){jalankanAksi(a.dataset.aksi);return}
  };
  hidupkanNeutron();
  E('#tombolOtak').onclick=bukaOtak;
  E('#btnCepat').onclick=tanyaCepat;
  E('#tanyaCepat').onkeydown=ev=>{if(ev.key==='Enter')tanyaCepat()};
  const tersimpan=muatLokal('oh_harian_'+HARI+'_'+L,null);
  if(tersimpan){tampilkanHarian(tersimpan)}
  E('#btnBuat').onclick=buatHarian;
  siapkanAI().then(ok=>{
    const n=E('#nadiOtak'), st=E('#statusOtak');
    if(!n)return;
    n.className=ok?'on':''; if(st)st.textContent=ok?t('otakHidup'):t('otakMati');
  });
}

/* ---- Sebarkan + disclaimer pendidikan ---- */
function tautanSaya(){ try{return location.href.split('#')[0]}catch(e){return ''} }
function bukaSebar(){
  const u=encodeURIComponent(tautanSaya());
  const pesan=encodeURIComponent(t('sebarPesan'));
  const jalur=[
    ['WhatsApp','https://wa.me/?text='+pesan+'%20'+u],
    ['Telegram','https://t.me/share/url?url='+u+'&text='+pesan],
    ['X','https://twitter.com/intent/tweet?text='+pesan+'&url='+u],
    ['Facebook','https://www.facebook.com/sharer/sharer.php?u='+u],
    ['Email','mailto:?subject='+encodeURIComponent('Ocklu Herbal')+'&body='+pesan+'%20'+u],
  ];
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button>
     <b>📣 ${esc(t('sebar'))}</b><span></span></div>
   <section class="blok" style="border:0">
     <div class="kotak"><b>${esc(t('sebarJ'))}</b>
       <div class="mini" style="margin-top:4px">${esc(t('sebarCatatan'))}</div>
       <div class="chips" style="margin-top:10px">
         ${jalur.map(([n,h])=>`<a class="chip" href="${h}" target="_blank" rel="noopener">${esc(n)}</a>`).join('')}
       </div>
       <button type="button" class="btn utama" id="salinTautan" style="width:100%;margin-top:6px">🔗 ${esc(t('salinTautan'))}</button></div>
     <div class="kotak">
       <b>${esc(t('teksSiap'))}</b>
       <textarea id="teksSebar" rows="5" style="margin-top:8px">${esc(t('sebarPesan'))}\n\n${esc(tautanSaya())}</textarea>
       <button type="button" class="btn" id="salinTeks" style="width:100%;margin-top:8px">${esc(t('salin'))}</button></div>
     <div class="kotak bahaya"><b>⚠ ${esc(t('disJudul'))}</b>
       <div style="margin-top:6px">${esc(t('disIsi'))}</div></div>
   </section>`;
  E('#salinTautan').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(tautanSaya());E('#salinTautan').textContent='✓'};
  E('#salinTeks').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(E('#teksSebar').value);E('#salinTeks').textContent='✓'};
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}
/* disclaimer sekali di kunjungan pertama */
function disclaimerAwal(){
  if(muatLokal('oh_setuju',false))return;
  const k=document.createElement('div');
  k.style.cssText='position:fixed;inset:auto 0 0 0;z-index:200;padding:16px 16px calc(16px + env(safe-area-inset-bottom));'
    +'background:linear-gradient(180deg,var(--kabut2),var(--kabut1));border-top:2px solid var(--line2);backdrop-filter:blur(14px)';
  k.innerHTML=`<div style="max-width:1180px;margin:0 auto;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
    <div style="flex:1;min-width:220px;font-size:calc(15px * var(--skala));color:var(--ink)"><b>${esc(t('disJudul'))}</b> — ${esc(t('disIsi'))}</div>
    <button type="button" class="btn utama" id="setujuDis">${esc(t('disOke'))}</button></div>`;
  document.body.appendChild(k);
  k.querySelector('#setujuDis').onclick=()=>{simpan('oh_setuju',true);k.remove()};
}

/* ---- Premium: apa yang didapat, berapa, bayar lewat apa ---- */
const PREMIUM=()=>muatLokal('oh_premium',false);
function bukaPremium(){
  const b=D.bayar||{};
  const punya=PREMIUM();
  const ew=(b.ewallet||[]).filter(x=>x.tautan);
  const kr=(b.kripto||[]).filter(x=>x.alamat);
  const kartu=b.kartu_luar_negeri&&b.kartu_luar_negeri.tautan?b.kartu_luar_negeri:null;
  const untung=[t('prem1'),t('prem2'),t('prem3'),t('prem4'),t('prem5'),t('prem6')];
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button>
     <b>⭐ ${esc(t('premium'))}</b><span></span></div>
   <section class="blok" style="border:0">
     ${punya?`<div class="kotak baik"><b>✓ ${esc(t('premAktif'))}</b>
       <button type="button" class="btn" id="matikanPrem" style="margin-top:8px">${esc(t('premMati'))}</button></div>`:''}
     <div class="kotak">
       <div class="harga"><b>$${b.harga_usd||5}</b><span class="mini">/${esc(t('perBulan'))} · ${(b.harga_idr||0).toLocaleString('id-ID')&&'Rp '+(b.harga_idr||0).toLocaleString('id-ID')}</span></div>
       <ul class="daftar">${untung.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
       <div class="mini" style="margin-top:8px">${esc(t('premJujur'))}</div>
     </div>
     <div class="judulkol">${esc(t('bayarLewat'))}</div>
     <div class="bayarpilih" id="pilihBayar">
       ${b.qris?`<button type="button" class="chip on" data-bayar="qris">🇮🇩 QRIS</button>`:''}
       ${ew.map(x=>`<button type="button" class="chip" data-bayar="ew:${esc(x.nama)}">${esc(x.nama)}</button>`).join('')}
       ${kartu?`<button type="button" class="chip" data-bayar="kartu">💳 ${esc(kartu.nama)}</button>`:''}
       ${b.paypal?`<button type="button" class="chip" data-bayar="paypal">PayPal</button>`:''}
       ${kr.map(x=>`<button type="button" class="chip" data-bayar="kr:${esc(x.jaringan)}">₿ ${esc(x.jaringan)}</button>`).join('')}
     </div>
     <div id="isiBayar"></div>
     ${(!b.qris&&!ew.length&&!kartu&&!b.paypal&&!kr.length)?`<div class="kotak awas">${esc(t('bayarBelum'))}</div>`:''}
     <div class="kotak" style="margin-top:12px">
       <b>${esc(t('kodeAktif'))}</b>
       <div class="mini" style="margin:4px 0 8px">${esc(b.cara_aktif||'')}</div>
       <div style="display:flex;gap:8px">
         <input class="t" id="kodePrem" placeholder="${esc(t('kodeIsi'))}" style="flex:1">
         <button type="button" class="btn utama" id="kirimKode">OK</button></div>
       <div id="hasilKode" class="mini" style="margin-top:6px"></div></div>
   </section>`;
  const tampil=(jenis)=>{
    const k=E('#isiBayar'); if(!k)return;
    const qr=(teks,judul,catatan)=>{
      k.innerHTML=`<div class="qrkotak"><div id="qrTempat"></div>
        <b style="font-size:14px">${esc(judul)}</b>
        <div style="font-size:11.5px;word-break:break-all;text-align:center;max-width:280px">${esc(teks)}</div>
        ${catatan?`<div style="font-size:11.5px;color:#555">${esc(catatan)}</div>`:''}</div>
        <button type="button" class="btn" id="salinBayar" style="width:100%">${esc(t('salin'))}</button>`;
      try{new QRCode(document.getElementById('qrTempat'),{text:teks,width:220,height:220,correctLevel:QRCode.CorrectLevel.M})}
      catch(e){E('#qrTempat').textContent=teks}
      E('#salinBayar').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(teks);E('#salinBayar').textContent='✓'};
    };
    if(jenis==='qris')return qr(b.qris,b.qris_nama||'QRIS',t('qrisCatatan'));
    if(jenis==='kartu')return k.innerHTML=`<a class="btn utama" style="display:block;text-align:center;text-decoration:none" href="${esc(kartu.tautan)}" target="_blank" rel="noopener">${esc(kartu.nama)} →</a>`;
    if(jenis==='paypal')return k.innerHTML=`<a class="btn utama" style="display:block;text-align:center;text-decoration:none" href="${esc(b.paypal)}" target="_blank" rel="noopener">PayPal →</a>`;
    if(jenis.startsWith('ew:')){const x=ew.find(y=>y.nama===jenis.slice(3));
      return k.innerHTML=`<a class="btn utama" style="display:block;text-align:center;text-decoration:none" href="${esc(x.tautan)}" target="_blank" rel="noopener">${esc(x.nama)} →</a>`}
    if(jenis.startsWith('kr:')){const x=kr.find(y=>y.jaringan===jenis.slice(3));
      return qr(x.alamat,x.jaringan,t('kriptoCatatan'))}
  };
  const awal=b.qris?'qris':(ew[0]?'ew:'+ew[0].nama:(kartu?'kartu':(b.paypal?'paypal':(kr[0]?'kr:'+kr[0].jaringan:''))));
  if(awal)tampil(awal);
  E('#pilihBayar').onclick=e=>{const c=e.target.closest('[data-bayar]');
    if(c){[...E('#pilihBayar').children].forEach(x=>x.classList.remove('on'));c.classList.add('on');tampil(c.dataset.bayar)}};
  E('#kirimKode').onclick=()=>{
    const k=(E('#kodePrem').value||'').trim().toUpperCase();
    if(k && k===String(b.kode_aktif||'').toUpperCase()){
      simpan('oh_premium',true); E('#hasilKode').textContent='✓ '+t('premAktif'); setTimeout(bukaPremium,700);
    } else E('#hasilKode').textContent='✕ '+t('kodeSalah');
  };
  const mati=E('#matikanPrem'); if(mati)mati.onclick=()=>{simpan('oh_premium',false);bukaPremium()};
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}

/* ---- panel Otak Neutron: yang baru, sedang hype, wabah & asap ---- */
function bukaOtak(bagian){
  const hy=D.hype||{}, wb=D.wabah||{};
  const baru=[...D.tanaman].sort((a,b)=>String(b.ditambah||'').localeCompare(String(a.ditambah||''))).slice(0,12);
  const tglBaru=baru.length?baru[0].ditambah:'';
  const ramuanBaru=[...D.ramuan].filter(r=>r.tanggal).sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal))).slice(0,5);
  const u=wb.udara||{};
  const warnaAqi=(a)=>a<=50?'j':a<=100?'g':a<=150?'g':'m';
  const pil=(k,lbl)=>`<button type="button" class="chip ${(bagian||'baru')===k?'on':''}" data-otak="${k}">${esc(lbl)}</button>`;
  const isiBagian=()=>{
    const b=bagian||'baru';
    if(b==='hype'){
      const top=(hy.terpopuler||[]), naik=(hy.paling_naik||[]);
      if(!top.length)return `<div class="kosong">${esc(t('kosong'))}</div>`;
      return `<div class="judulkol">${esc(t('hypeNaik'))}</div>
        <div class="daftarpanjang" style="max-height:none;margin-bottom:14px">
        ${naik.map(x=>`<button type="button" class="barisklik" data-slug3="${x.slug}">
          <span>${esc(x.nama||x.latin)}<div class="mini">${esc(x.judul)}</div></span>
          <b style="color:var(--jade)">+${x.naik_persen}%</b></button>`).join('')}</div>
        <div class="judulkol">${esc(t('hypeTop'))}</div>
        <div class="daftarpanjang" style="max-height:none">
        ${top.map((x,i)=>`<button type="button" class="barisklik" data-slug3="${x.slug}">
          <span>${i+1}. ${esc(x.nama||x.latin)}<div class="mini">${esc(x.judul)}</div></span>
          <b>${x.minggu_ini.toLocaleString()}</b></button>`).join('')}</div>
        <div class="mini" style="margin-top:10px">${esc(t('sumber'))}: ${esc(hy.sumber||'')} · ${esc(hy.diperbarui||'')}</div>`;
    }
    if(b==='wabah'){
      const sakit=(wb.paling_dicari||[]);
      const who=(wb.wabah_who||[]);
      return `
      ${u.aqi?`<div class="kotak ${u.asap?'bahaya':'baik'}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <div><b style="font-family:var(--serif);font-size:19px">${esc(t('udara'))} · ${esc(u.kota||'')}</b>
            <div class="mini">PM2.5 ${u.pm2_5} µg/m³ · PM10 ${u.pm10} · ${esc(u.waktu||'')}</div></div>
          <div style="text-align:right"><b style="font-family:var(--serif);font-size:26px;color:var(--gold)">${u.aqi}</b>
            <div class="mini">${esc(u.tingkat||'')}</div></div></div>
        ${u.asap?`<div style="margin-top:8px">${esc(t('asapNasihat'))}</div>
          <div class="chips" style="margin-top:8px">${(wb.herbal_asap&&wb.herbal_asap.tanaman||[]).map(x=>
            `<button type="button" class="chip" data-slug3="${x.slug}">🌿 ${esc(x.nama)} <b style="opacity:.6">${esc(x.bukti)}</b></button>`).join('')}</div>`:''}
        <div class="mini" style="margin-top:8px">${esc(t('sumber'))}: ${esc(u.sumber||'')}</div></div>`:''}
      <div class="judulkol" style="margin-top:14px">${esc(t('sakitNaik'))}</div>
      <div class="daftarpanjang" style="max-height:none">
      ${sakit.map(x=>`<div class="kotak" style="margin:0 0 8px">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline">
          <b>${esc(x.penyakit)}</b>
          <span class="tag ${x.naik_persen>0?'j':'abu'}">${x.naik_persen>0?'+':''}${x.naik_persen}% · ${x.minggu_ini.toLocaleString()}</span></div>
        ${(x.herbal&&x.herbal.tanaman||[]).length?`<div class="chips" style="margin-top:6px">${x.herbal.tanaman.map(h=>
          `<button type="button" class="chip" data-slug3="${h.slug}">🌿 ${esc(h.nama)} <b style="opacity:.6">${esc(h.bukti)}</b></button>`).join('')}</div>`:''}
        ${x.herbal&&x.herbal.hanya_dokter?`<div class="mini" style="color:var(--danger);margin-top:4px">⛔ ${esc(t('hanyaDokter'))}</div>`:''}
      </div>`).join('')}</div>
      ${who.length?`<div class="judulkol" style="margin-top:14px">${esc(t('whoJudul'))}</div>
      <div class="daftarpanjang" style="max-height:none">${who.map(x=>`<div class="kotak" style="margin:0 0 8px">
        <b>${esc(x.judul)}</b><div class="mini">${esc(x.tanggal)} · <a href="${esc(x.tautan)}" target="_blank" rel="noopener">WHO ↗</a></div>
        ${(x.herbal&&x.herbal.tanaman||[]).length?`<div class="chips" style="margin-top:6px">${x.herbal.tanaman.slice(0,4).map(h=>
          `<button type="button" class="chip" data-slug3="${h.slug}">🌿 ${esc(h.nama)}</button>`).join('')}</div>`:''}
        ${x.herbal&&x.herbal.hanya_dokter?`<div class="mini" style="color:var(--danger);margin-top:4px">⛔ ${esc(t('hanyaDokter'))}</div>`:''}
        </div>`).join('')}</div>`:''}
      <div class="kotak bahaya" style="margin-top:12px">${esc(wb.catatan||t('wajib'))}</div>`;
    }
    // baru
    return `<div class="judulkol">${esc(t('baruTanaman'))}</div>
      <div class="kisi" style="margin-bottom:14px">${baru.map(p=>kartu(p)).join('')}</div>
      ${ramuanBaru.length?`<div class="judulkol">${esc(t('baruRamuan'))}</div>
      <div class="daftarpanjang" style="max-height:none">${ramuanBaru.map(r=>
        `<button type="button" class="barisklik" data-ramuan="${D.ramuan.indexOf(r)}">
          <span>${esc(r['nama_'+L]||r.nama_id)}<div class="mini">${esc(r.tema||'')}</div></span>
          <b>${esc(r.tanggal)}</b></button>`).join('')}</div>`:''}
      <div class="mini" style="margin-top:10px">${esc(t('baruCatatan'))} ${esc(tglBaru)}</div>`;
  };
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button>
     <b>⚛︎ ${esc(t('otak'))}</b><span></span></div>
   <section class="blok" style="border:0">
     <div class="chips">${pil('baru',t('tabBaru'))}${pil('hype',t('tabHype'))}${pil('wabah',t('tabWabah'))}</div>
     <div id="isiOtak">${isiBagian()}</div></section>`;
  E('#lembarIsi').onclick=e=>{
    const b=e.target.closest('[data-otak]');
    if(b){bukaOtak(b.dataset.otak);return}
    const s3=e.target.closest('[data-slug3]');
    if(s3){buka(s3.dataset.slug3);return}
  };
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}


function tampilkanHarian(r){
  const k=E('#isiBuat'); if(!k)return;
  k.innerHTML=`<div class="kotak baik">
    <b style="font-family:var(--serif);font-size:calc(19px * var(--skala))">${esc(r.nama||'')}</b>
    <div class="mini">${esc(r.untuk||'')}</div>
    <div style="margin-top:8px">${(r.bahan||[]).map(b=>`<span class="tag j">${esc(b.nama)} ${esc(b.takaran||'')}</span>`).join('')}</div>
    <div style="margin-top:8px">${(r.langkah||[]).map(s=>`<div class="langkah"><div class="no">${s.no}</div>
      <div style="flex:1">${esc(s.kerja)}</div>${s.menit?`<span class="menit">⏱ ${s.menit}′</span>`:''}</div>`).join('')}</div>
    <div class="kotak" style="margin-top:8px">${baris(t('dosis'),r.dosis)}${baris(t('hasil'),r.hasil)}${baris(L==='id'?'Rasa':'Taste',r.rasa)}</div>
    ${r.catatan_jujur?`<div class="mini">📌 ${esc(r.catatan_jujur)}</div>`:''}
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <button type="button" class="btn utama" data-dapur="${encodeURIComponent(JSON.stringify(r.langkah||[]))}" data-judul="${esc(r.nama||'')}">👨‍🍳 ${esc(t('dapur'))}</button>
      <button type="button" class="btn" data-bawa="${esc((r.bahan||[]).map(b=>b.slug).join(','))}">⚗️ ${esc(t('bawa'))}</button></div></div>`;
  const b=E('#btnBuat'); if(b)b.style.display='none';
}
async function buatHarian(){
  const btn=E('#btnBuat');
  if(!await siapkanAI()){E('#isiBuat').innerHTML=`<div class="kotak awas">${esc(t('aiMati'))}</div>`;return}
  btn.disabled=true; btn.innerHTML=`<span class="muat"></span> ${esc(t('jalan'))}`;
  NEUTRON.kerja=true; const nadi=E('#nadiOtak'); if(nadi)nadi.className='kerja';
  const h=hariIni();
  const calon=kandidat(h.tema,22).filter(p=>(p.racun||{}).status!=='ya-berbahaya');
  const katalog=calon.slice(0,18).map(p=>{
    const o=olahUtama(p)||{};
    return `${p.slug} | ${nm(p)} / ${p.binomial} | ${(p.bagian_dipakai||[]).join(',')} | takaran lazim: ${o.bahan||'-'} | air ${o.air||'-'} | ${o.menit||'-'} menit | ${(p.khasiat||[]).slice(0,3).map(k=>k.keluhan+'('+k.bukti+')').join('; ')} | hamil:${p.aman_hamil}`;
  }).join('\n');
  try{
    const out=await AI.json(`Hari ini ${HARI}. Tema keluhan hari ini: "${h.tema}".
Susun SATU ramuan rumahan 3-4 bahan, HANYA dari katalog ini (pakai slug persis):
${katalog}
Takaran nyata, langkah dengan menit, dosis, rasa, dan kalimat jujur soal tingkat bukti. Jangan menjanjikan kesembuhan.
Bahasa: ${L}. JSON: {"nama":"","untuk":"","bahan":[{"slug":"","takaran":""}],"langkah":[{"no":1,"kerja":"","menit":5}],"dosis":"","hasil":"","rasa":"","catatan_jujur":""}`,
      {modelTier:'complex'});
    const sah=new Set(calon.map(p=>p.slug));
    out.bahan=(out.bahan||[]).filter(b=>sah.has(b.slug)).map(b=>({...b,nama:nm(PETA[b.slug])}));
    if(!out.bahan.length)throw new Error('AI menyebut tanaman di luar basis data');
    simpan('oh_harian_'+HARI+'_'+L,out);
    tampilkanHarian(out);
  }catch(e){E('#isiBuat').innerHTML=`<div class="kotak bahaya">${esc(e&&e.message||'')}</div>`}
  NEUTRON.kerja=false; if(nadi)nadi.className=AI?'on':'';
  btn.disabled=false; btn.innerHTML='⚗️ '+t('buatHari');
}

/* ---- inti neutron: gambar sendiri di canvas ---- */
let NEUTRON={jalan:false,kerja:false};
function hidupkanNeutron(){
  const c=E('#intiNeutron'); if(!c)return;
  const ctx=c.getContext('2d');
  const diam=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ukur=()=>{const r=c.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);
    c.width=Math.max(1,r.width*dpr); c.height=Math.max(1,r.height*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    return r};
  let r=ukur();
  window.addEventListener('resize',()=>{r=ukur()},{passive:true});
  const orbit=[{n:6,jari:.30,laju:.9,warna:'#45d9a0'},{n:8,jari:.44,laju:-.55,warna:'#e3be79'},{n:5,jari:.58,laju:.35,warna:'#7cc5ff'}];
  let t0=0;
  const gambar=(ts)=>{
    if(!c.isConnected)return;                       // halaman sudah ganti tab
    const w=r.width||c.clientWidth, h=r.height||190;
    const cx=w/2, cy=h/2, R=Math.min(w,h)/2;
    const d=(ts-t0)/1000;
    ctx.clearRect(0,0,w,h);
    // kabut
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    const terangN=document.documentElement.getAttribute('data-tema')==='terang'
      || (!document.documentElement.getAttribute('data-tema') && window.matchMedia
          && window.matchMedia('(prefers-color-scheme: light)').matches);
    g.addColorStop(0,'rgba('+(terangN?'10,120,80,':'69,217,160,')+(NEUTRON.kerja?.34:.22)+')');
    g.addColorStop(1,'rgba(69,217,160,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R,0,7); ctx.fill();
    // cincin orbit
    orbit.forEach((o,i)=>{
      ctx.strokeStyle=terangN?'rgba(10,90,60,.25)':'rgba(120,220,175,.2)'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.ellipse(cx,cy,R*o.jari*1.6,R*o.jari*.72,i*1.05,0,7); ctx.stroke();
      for(let k=0;k<o.n;k++){
        const a=(k/o.n)*Math.PI*2 + d*o.laju*(NEUTRON.kerja?2.4:1);
        const x=cx+Math.cos(a)*R*o.jari*1.6, y=cy+Math.sin(a)*R*o.jari*.72;
        const px=cx+(x-cx)*Math.cos(i*1.05)-(y-cy)*Math.sin(i*1.05);
        const py=cy+(x-cx)*Math.sin(i*1.05)+(y-cy)*Math.cos(i*1.05);
        ctx.fillStyle=o.warna; ctx.globalAlpha=.85;
        ctx.beginPath(); ctx.arc(px,py,2.1,0,7); ctx.fill(); ctx.globalAlpha=1;
      }
    });
    // inti
    const nadi=1+Math.sin(d*(NEUTRON.kerja?6:2))*0.06;
    const gi=ctx.createRadialGradient(cx-R*.06,cy-R*.06,0,cx,cy,R*.22*nadi);
    gi.addColorStop(0,terangN?'#ffffff':'#eafff6'); gi.addColorStop(.45,terangN?'#0a8f5e':'#45d9a0');
    gi.addColorStop(1,'rgba(13,90,64,.15)');
    ctx.fillStyle=gi; ctx.beginPath(); ctx.arc(cx,cy,R*.22*nadi,0,7); ctx.fill();
    if(!diam)requestAnimationFrame(gambar);
  };
  requestAnimationFrame(ts=>{t0=ts;gambar(ts)});
}

async function tanyaCepat(){
  const inp=E('#tanyaCepat'), q=(inp.value||'').trim(); if(!q)return;
  const kotak=E('#jawabCepat');
  if(!await siapkanAI()){kotak.innerHTML=`<div class="kotak awas" style="margin:0 12px 12px">${esc(t('aiMati'))}</div>`;return}
  NEUTRON.kerja=true;
  const nadi=E('#nadiOtak'); if(nadi)nadi.className='kerja';
  kotak.innerHTML=`<div class="kotak" style="margin:0 12px 12px"><span class="muat"></span> ${esc(t('jalan'))}</div>`;
  const calon=kandidat(q,20);
  const ctx=calon.map(p=>`${p.slug} | ${nm(p)} / ${p.binomial} | ${(p.khasiat||[]).slice(0,3).map(k=>k.keluhan+'('+k.bukti+')').join('; ')} | hamil:${p.aman_hamil} racun:${(p.racun||{}).status}`).join('\n');
  try{
    const out=await AI.json(`Data tanaman yang boleh dipakai:\n${ctx}\n\nPertanyaan/keluhan: ${q}
Jawab pendek (maks 90 kata) dalam bahasa ${L}, dari data ini saja; kalau tidak ada di data, bilang tidak ada.
Sebut tanaman yang paling masuk akal (slug) dan satu langkah aman yang bisa dilakukan sekarang.
JSON: {"jawab":"","slug":[],"langkah_sekarang":""}`,{modelTier:'complex'});
    const sah=(out.slug||[]).filter(s=>PETA[s]);
    kotak.innerHTML=`<div class="kotak" style="margin:0 12px 12px">
      ${esc(out.jawab||'')}
      ${out.langkah_sekarang?`<div class="mini" style="margin-top:6px">👉 ${esc(out.langkah_sekarang)}</div>`:''}
      <div class="chips" style="margin-top:8px">${sah.map(s=>`<button type="button" class="chip" data-slug2="${s}">🌿 ${esc(nm(PETA[s]))}</button>`).join('')}</div>
      ${sah.length?`<button type="button" class="btn utama" style="width:100%;margin-top:4px" data-bawa="${esc(sah.join(','))}">⚗️ ${esc(t('bawa'))}</button>`:''}
      <div class="mini" style="margin-top:8px">${esc(t('wajib'))}</div></div>`;
    kotak.onclick=e=>{const b=e.target.closest('[data-slug2]'); if(b)buka(b.dataset.slug2)};
  }catch(e){kotak.innerHTML=`<div class="kotak bahaya" style="margin:0 12px 12px">${esc(e&&e.message||'')}</div>`}
  NEUTRON.kerja=false; if(nadi)nadi.className=AI?'on':'';
}

const fotoRamuan = x => {
  for(const b of (x.bahan||[])){
    const p=D.tanaman.find(t=>t.binomial&&(b.tanaman||'').toLowerCase().includes(t.binomial.toLowerCase()));
    if(p&&FOTO[p.slug])return FOTO[p.slug]}
  return '';
};
/* ---- Jelajah ---- */
function vJelajah(){
  const trad=Object.keys(D.indeks.tradisi||{}).sort();
  const urut=['tropis','subtropis','sedang','dingin','kering','pegunungan'];
  const ikl=Object.keys(D.indeks.iklim||{}).sort((a,b)=>{
    const ia=urut.findIndex(x=>a.includes(x)),ib=urut.findIndex(x=>b.includes(x));
    return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});
  E('#isi').innerHTML=`
   <div class="cari"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
     <input id="q" value="${esc(Q)}" placeholder="${esc(t('cari'))}" enterkeyhint="search"></div>
   <div class="saringan">
     <select class="f" id="fT"><option value="">${esc(t('tradisi'))}: ${esc(t('semua'))}</option>${trad.map(x=>`<option ${FIL.tradisi===x?'selected':''}>${esc(x)}</option>`).join('')}</select>
     <select class="f" id="fI"><option value="">${esc(t('iklim'))}: ${esc(t('semua'))}</option>${ikl.map(x=>`<option ${FIL.iklim===x?'selected':''}>${esc(x)}</option>`).join('')}</select>
   </div>
   <div class="chips" id="chips"></div><div class="kisi" id="kisi"></div>`;
  E('#q').addEventListener('input',e=>{Q=e.target.value;isiKisi()});
  E('#fT').addEventListener('change',e=>{FIL.tradisi=e.target.value;isiKisi()});
  E('#fI').addEventListener('change',e=>{FIL.iklim=e.target.value;isiKisi()});
  const top=Object.entries(D.indeks.keluhan||{}).sort((a,b)=>b[1].length-a[1].length).slice(0,14);
  const label=k=>L==='id'?k:((D.kamus[L]||{})[k]||k);
  E('#chips').innerHTML=top.map(([k,v])=>`<button type="button" class="chip ${Q===k?'on':''}" data-k="${esc(k)}">${esc(label(k))} <b style="opacity:.55">${v.length}</b></button>`).join('');
  E('#chips').addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){Q=Q===c.dataset.k?'':c.dataset.k;vJelajah()}});
  isiKisi();
}
function isiKisi(){
  const q=Q.toLowerCase().trim();
  const hasil=D.tanaman.filter(p=>{
    if(FIL.tradisi&&!(p.tradisi||[]).includes(FIL.tradisi))return false;
    if(FIL.iklim&&!(p.iklim||[]).map(x=>String(x).toLowerCase()).includes(FIL.iklim))return false;
    if(!q)return true;
    let blob=(JSON.stringify(p.nama||{})+' '+p.binomial+' '+JSON.stringify(p.nama_lain||[])+' '+
      JSON.stringify(p.khasiat||[])+' '+JSON.stringify(p.kandungan||[])+' '+(p.famili||'')).toLowerCase();
    for(const k of (p.khasiat||[])){const a=(k.keluhan||'').toLowerCase();
      for(const b of ['en','zh','ja','ko','ru']){const v=(D.kamus[b]||{})[a];if(v)blob+=' '+v.toLowerCase()}}
    return q.split(/\s+/).every(w=>blob.includes(w));
  });
  E('#kisi').innerHTML=hasil.length?hasil.map(kartu).join(''):`<div class="kosong">🍃<br>${esc(t('kosong'))}</div>`;
}
/* ---- Peta digital: di negara mana tanaman ini benar-benar tercatat ---- */
let PETA_SARING='';
function hitungNegara(saring){
  const per={}, daftar={};
  const q=(saring||'').toLowerCase().trim();
  for(const p of D.tanaman){
    if(q){
      const blob=(JSON.stringify(p.khasiat||[])+JSON.stringify(p.nama||{})+p.binomial+(p.tradisi||[]).join(' ')).toLowerCase();
      let cocok=blob.includes(q);
      if(!cocok)for(const k of (p.khasiat||[])){const a=(k.keluhan||'').toLowerCase();
        for(const b of ['en','zh','ja','ko','ru']){const v=(D.kamus[b]||{})[a];if(v&&v.toLowerCase().includes(q))cocok=true}}
      if(!cocok)continue;
    }
    for(const n of ((p.sebaran_nyata||{}).negara||[])){
      per[n.kode]=(per[n.kode]||0)+1;
      (daftar[n.kode]=daftar[n.kode]||[]).push({slug:p.slug,jumlah:n.jumlah});
    }
  }
  return {per,daftar};
}
function vPeta(){
  const W=window.DUNIA;
  if(!W){E('#isi').innerHTML=`<div class="kosong">${esc(t('kosong'))}</div>`;return}
  E('#isi').innerHTML=`
    <div class="cari"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="qPeta" value="${esc(PETA_SARING)}" placeholder="${esc(t('petaCari'))}"></div>
    <div class="petakotak">
      <canvas id="peta"></canvas>
      <div class="petaket">
        <span class="mini">${esc(t('petaKet'))}</span>
        <div class="skala" id="skalaWarna"></div>
        <span class="mini" id="petaAngka"></span></div>
    </div>
    <div id="isiNegara" style="margin-top:12px"></div>
    <div class="mini" style="margin-top:8px">${esc(t('sumber'))}: GBIF · ${esc(W.sumber||'')}</div>`;
  const terangKini=document.documentElement.getAttribute('data-tema')==='terang'
    || (!document.documentElement.getAttribute('data-tema') && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: light)').matches);
  E('#skalaWarna').innerHTML=(terangKini?['#dbe7dd','#bfe0cd','#84cba8','#3fae7c','#b8860b']
    :['#12352a','#1c6b4d','#2fa373','#45d9a0','#e3be79']).map(c=>`<i style="background:${c}"></i>`).join('');
  E('#qPeta').oninput=e=>{PETA_SARING=e.target.value;gambarPeta()};
  gambarPeta();
  window.addEventListener('resize',gambarPeta,{passive:true});
}
function gambarPeta(){
  const c=E('#peta'), W=window.DUNIA; if(!c||!W)return;
  const {per}=hitungNegara(PETA_SARING);
  const nilai=Object.values(per); const maks=Math.max(1,...nilai);
  const r=c.getBoundingClientRect(), dpr=Math.min(2,window.devicePixelRatio||1);
  c.width=Math.max(1,r.width*dpr); c.height=Math.max(1,r.height*dpr);
  const ctx=c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=r.width,h=r.height;
  const px=(lon)=>(lon+180)/360*w, py=(lat)=>(84-lat)/(84+60)*h;   // potong kutub yang kosong
  ctx.clearRect(0,0,w,h);
  const gaya=getComputedStyle(document.documentElement);
  const bgPeta=(gaya.getPropertyValue('--petabg')||'#071a14').trim();
  const kosongPeta=(gaya.getPropertyValue('--petakosong')||'#14332a').trim();
  const terang=document.documentElement.getAttribute('data-tema')==='terang'
    || (!document.documentElement.getAttribute('data-tema') && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: light)').matches);
  ctx.fillStyle=bgPeta; ctx.fillRect(0,0,w,h);
  // garis lintang/bujur tipis
  ctx.strokeStyle=terang?'rgba(10,70,50,.10)':'rgba(120,220,175,.08)'; ctx.lineWidth=1;
  for(let lon=-180;lon<=180;lon+=30){ctx.beginPath();ctx.moveTo(px(lon),0);ctx.lineTo(px(lon),h);ctx.stroke()}
  for(let lat=-60;lat<=80;lat+=30){ctx.beginPath();ctx.moveTo(0,py(lat));ctx.lineTo(w,py(lat));ctx.stroke()}
  const tangga=terang?['#dbe7dd','#bfe0cd','#84cba8','#3fae7c','#b8860b']
                     :['#12352a','#1c6b4d','#2fa373','#45d9a0','#e3be79'];
  const warna=(n)=>{
    if(!n)return kosongPeta;
    const f=Math.min(1,Math.log(1+n)/Math.log(1+maks));
    if(f>.85)return tangga[4]; if(f>.6)return tangga[3]; if(f>.35)return tangga[2];
    if(f>.15)return tangga[1]; return tangga[0];
  };
  for(const n of W.negara){
    if(n.iso==='AQ')continue;                       // Antartika tidak dipakai
    const jml=per[n.iso]||0;
    ctx.fillStyle=warna(jml); ctx.strokeStyle=terang?'rgba(255,255,255,.9)':'rgba(8,19,15,.85)'; ctx.lineWidth=.6;
    ctx.beginPath();
    for(const cincin of n.cincin){
      let lewat=false, minx=999, maxx=-999;
      for(const pt of cincin){
        if(pt[1]>84||pt[1]<-60){lewat=true;break}
        if(pt[0]<minx)minx=pt[0]; if(pt[0]>maxx)maxx=pt[0];
      }
      if(lewat||(maxx-minx)>180)continue;            // di luar peta atau melompati garis tanggal
      cincin.forEach((pt,i)=>{const X=px(pt[0]),Y=py(pt[1]); i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});
      ctx.closePath();
    }
    ctx.fill(); ctx.stroke();
  }
  const ket=E('#petaAngka');
  if(ket)ket.textContent=`${Object.keys(per).length} ${L==='id'?'negara':'countries'} · ${L==='id'?'terbanyak':'max'} ${maks} ${t('s_tanaman')}`;
  c.onclick=(ev)=>{
    const b=c.getBoundingClientRect();
    const mx=ev.clientX-b.left, my=ev.clientY-b.top;
    const lon=mx/w*360-180, lat=84-(my/h)*(84+60);
    const neg=W.negara.find(n=>n.cincin.some(cin=>didalam(lon,lat,cin)));
    if(neg)tampilNegara(neg);
  };
}
function didalam(x,y,ring){
  let di=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
    if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/((yj-yi)||1e-9)+xi))di=!di;
  }
  return di;
}
function tampilNegara(neg){
  const {daftar}=hitungNegara(PETA_SARING);
  const isi=(daftar[neg.iso]||[]).sort((a,b)=>b.jumlah-a.jumlah).slice(0,40);
  const nama=(window.DUNIA.nama_id||{})[neg.iso]||neg.nama;
  E('#isiNegara').innerHTML=`<div class="kotak">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
      <b style="font-family:var(--serif);font-size:19px">${esc(nama)}</b>
      <span class="tag g">${isi.length} ${esc(t('s_tanaman'))}</span></div>
    ${isi.length?`<div class="kisi" style="margin-top:10px">${isi.map(x=>PETA[x.slug]?kartu(PETA[x.slug]):'').join('')}</div>`
      :`<div class="mini" style="margin-top:8px">${esc(t('petaKosong'))}</div>`}</div>`;
  E('#isiNegara').scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---- Racik sendiri ---- */
function vRacik(){
  E('#isi').innerHTML=`
   <div class="kotak">
     <b>⚗️ ${esc(t('racikJ'))}</b>
     <div class="cari" style="margin-top:10px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
       <input id="cb" placeholder="${esc(t('pilih'))}…"></div>
     <div class="chips" id="terpilih" style="margin-top:9px"></div>
     <div class="chips" id="daftarB" style="max-height:180px;overflow:auto"></div>
     <div style="display:flex;align-items:center;gap:10px;margin-top:10px">
       <span class="mini">${esc(t('porsi'))}</span>
       <button class="btn" id="kurang">−</button><b id="porsiN" style="font-family:var(--serif);font-size:20px;min-width:28px;text-align:center">${PORSI}</b>
       <button class="btn" id="tambah">+</button>
       <div style="flex:1"></div>
       <button class="btn" id="kosongkan">✕</button></div>
   </div>
   <div id="hasilRacik"></div>`;
  const isi=()=>{
    const q=(E('#cb').value||'').toLowerCase();
    E('#daftarB').innerHTML=D.tanaman.filter(p=>!q||(nm(p)+' '+p.binomial).toLowerCase().includes(q)).slice(0,40)
      .map(p=>`<button type="button" class="chip ${BAHAN.includes(p.slug)?'on':''}" data-b="${p.slug}">${esc(nm(p))}</button>`).join('');
    E('#terpilih').innerHTML=BAHAN.map(s=>`<button type="button" class="chip on" data-b="${s}">${esc(nm(PETA[s]))} ✕</button>`).join('')
      || `<span class="mini">${esc(t('pilih'))}</span>`;
    gambarHasil();
  };
  E('#cb').addEventListener('input',isi);
  E('#isi').onclick=e=>{
    const c=e.target.closest('[data-b]');
    if(c){const s=c.dataset.b; BAHAN.includes(s)?BAHAN=BAHAN.filter(x=>x!==s):BAHAN.push(s);
      simpan('oh_bahan',BAHAN); isi(); return}
    if(e.target.closest('#tambah')){PORSI=Math.min(8,PORSI+1);simpan('oh_porsi',PORSI);E('#porsiN').textContent=PORSI;gambarHasil()}
    if(e.target.closest('#kurang')){PORSI=Math.max(1,PORSI-1);simpan('oh_porsi',PORSI);E('#porsiN').textContent=PORSI;gambarHasil()}
    if(e.target.closest('#kosongkan')){BAHAN=[];simpan('oh_bahan',BAHAN);isi()}
  };
  isi();
}
function gambarHasil(){
  const kotak=E('#hasilRacik'); if(!kotak)return;
  if(!BAHAN.length){kotak.innerHTML=`<div class="kosong">⚗️<br>${esc(t('pilih'))}</div>`;return}
  const r=hitungRacikan(BAHAN,PORSI);
  const warna=r.nilai==='cocok'?'baik':r.nilai==='hati-hati'?'awas':'bahaya';
  const labelNilai=r.nilai==='cocok'?t('cocok'):r.nilai==='hati-hati'?t('hatiHati'):t('jangan');
  kotak.innerHTML=`
   <div class="kotak ${warna}" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
     <b style="font-size:17px">${r.nilai==='cocok'?'✅':r.nilai==='hati-hati'?'⚠️':'⛔'} ${esc(labelNilai)}</b>
     <span class="mini">${bkt(['tradisional','studi awal','bukti kuat'][r.bukti])}</span>
     <div style="flex:1"></div>
     <span class="tag">💧 ${r.air} ml</span><span class="tag">🥃 ${r.jadi} ml</span><span class="tag">⏱ ${r.waktuTotal} ${esc(t('menit'))}</span></div>

   <div class="kotak"><b>${esc(t('takaran'))}</b>
     <div class="tabel" style="margin-top:8px">
     ${r.bahan.map(b=>`<div class="trow"><div class="tc1">
        ${FOTO[b.slug]?`<img src="${FOTO[b.slug]}" alt="" class="ikon">`:'<span class="ikon mono">🌿</span>'}
        <div><b>${esc(b.nama)}</b><div class="mini">${esc(b.bagian||'')} · ${esc(b.metode)}</div></div></div>
        <div class="tc2"><b>${b.jumlah} ${esc(b.satuan)}</b>${b.kira?`<div class="mini">${L==='id'?'perkiraan':'estimate'}</div>`:''}</div>
        <div class="tc3"><span class="tag ${b.tahap===1?'g':b.tahap===3?'b':''}">${esc(t('tahap'))} ${b.tahap}</span><div class="mini">${b.menit}′</div></div></div>`).join('')}
     </div>
     <div class="mini" style="margin-top:8px">${L==='id'?`Rumus air: 250 ml × ${r.porsi} gelas + 10 ml tiap menit rebus = ${r.air} ml; menguap ±${r.uap} ml.`:`Water: 250 ml × ${r.porsi} + 10 ml per simmering minute = ${r.air} ml; ~${r.uap} ml evaporates.`}</div></div>

   <div class="kotak"><b>👨‍🍳 ${esc(t('prosedur'))}</b>
     <button class="btn utama" style="margin:10px 0;width:100%" data-dapur="${encodeURIComponent(JSON.stringify(r.langkah))}" data-judul="${esc(t('racikJ'))}">▶ ${esc(t('dapur'))}</button>
     ${r.langkah.map(s=>`<div class="langkah"><div class="no">${s.no}</div>
       <div style="flex:1">${esc(s.kerja)}${s.suhu?` <span class="mini">· ${esc(s.suhu)}</span>`:''}</div>
       ${s.menit?`<span class="menit">⏱ ${s.menit}′</span>`:''}</div>`).join('')}</div>

   <div class="dua">
     <div class="kotak baik"><b>✔ ${esc(t('doa'))}</b>
       <ul class="daftar">${r.bahan.filter(b=>b.tips).map(b=>`<li><b>${esc(b.nama)}</b>: ${esc(b.tips)}</li>`).join('')}
       <li>${L==='id'?'Panci kaca, tanah liat, atau stainless':'Glass, clay or stainless pot'}</li>
       <li>${L==='id'?'Minum hangat sesudah makan; hari pertama setengah dosis':'Drink warm after food; half dose on day one'}</li>
       <li>${L==='id'?'Buat sedikit, habiskan dalam sehari':'Make small batches, finish within a day'}</li></ul></div>
     <div class="kotak bahaya"><b>⛔ ${esc(t('dont'))}</b>
       <ul class="daftar">
       <li>${L==='id'?'Jangan panci besi/aluminium':'No iron or aluminium pot'}</li>
       <li>${L==='id'?'Jangan sampai air habis / gosong':'Never let it boil dry'}</li>
       ${r.pasanganBahaya.map(x=>`<li><b>${esc(x.a)} + ${esc(x.b)}</b>: ${esc(x.akibat)}</li>`).join('')}
       ${r.beracun.map(b=>`<li>☠ <b>${esc(b.nama)}</b>: ${L==='id'?'tanaman keras, jangan diracik sendiri':'potent plant, not for home use'}</li>`).join('')}
       ${r.obatKimia.slice(0,4).map(o=>`<li>💊 ${esc(o.bahan)} + ${esc(o.obat)}: ${esc(o.akibat)}</li>`).join('')}
       </ul></div></div>

   ${r.pasanganBaik.length?`<div class="kotak baik"><b>🤝 ${esc(t('baik'))}</b>
     <ul class="daftar">${r.pasanganBaik.map(x=>`<li><b>${esc(x.a)} + ${esc(x.b)}</b>: ${esc(x.akibat)}</li>`).join('')}</ul></div>`:''}

   <div class="kotak awas"><b>⚠ ${esc(t('pantang'))}</b>
     <div class="baris"><b>${esc(t('aHamil'))}</b><span>${esc(r.hamil)}</span></div>
     <div class="baris"><b>${esc(t('aAnak'))}</b><span>${esc(r.anak)}</span></div>
     ${r.simpanLama?`<div class="baris"><b>${esc(t('simpan'))}</b><span>${esc(r.simpanLama)}</span></div>`:''}
     <ul class="daftar">${r.pantangan.slice(0,8).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>

   <div class="kotak"><b>${esc(t('dosis'))}</b>
     <ul class="daftar">${r.bahan.filter(b=>b.dosis).map(b=>`<li><b>${esc(b.nama)}</b>: ${esc(b.dosis)}</li>`).join('')}</ul>
     <div class="mini">${L==='id'?'Kalau beda-beda, ikuti dosis yang paling kecil.':'When they differ, follow the smallest dose.'}</div></div>

   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
     <button class="btn utama" id="periksaAI" style="flex:1">🧠 ${esc(t('periksa'))}</button>
     <button class="btn" id="simpanRacikan">💾 ${esc(t('simpanR'))}</button>
     <button class="btn" onclick="window.print()">🖨</button></div>
   <div id="nilaiAI"></div>
   <div class="kotak awas" style="margin-top:10px;font-size:12.5px">${esc(t('wajib'))}</div>`;
  E('#periksaAI').addEventListener('click',()=>periksaWorker(r));
  E('#simpanRacikan').addEventListener('click',()=>{
    const s=muatLokal('oh_racikan',[]); s.unshift({tanggal:HARI,bahan:BAHAN.slice(),porsi:PORSI});
    simpan('oh_racikan',s.slice(0,20)); E('#simpanRacikan').textContent='✓';
  });
}
async function periksaWorker(r){
  const b=E('#periksaAI');
  if(!await siapkanAI()){E('#nilaiAI').innerHTML=`<div class="kotak awas">${esc(t('aiMati'))}</div>`;return}
  b.disabled=true; b.innerHTML=`<span class="muat"></span> ${esc(t('jalan'))}`;
  const ringkas={
    porsi:r.porsi, air_ml:r.air, jadi_ml:r.jadi, menit:r.waktuTotal, nilai:r.nilai,
    bahan:r.bahan.map(x=>({nama:x.nama,latin:x.latin,jumlah:x.jumlah+' '+x.satuan,tahap:x.tahap,menit:x.menit,
      khasiat:(x.p.khasiat||[]).slice(0,3).map(k=>k.keluhan+' ('+k.bukti+')'),
      kandungan:(x.p.kandungan||[]).slice(0,3).map(k=>k.nama)})),
    bagus:r.pasanganBaik, bahaya:r.pasanganBahaya, hamil:r.hamil, anak:r.anak
  };
  try{
    const out=await AI.json(`Kamu worker peracik herbal yang teliti dan jujur. Ini racikan yang disusun pemakai,
takaran sudah dihitung mesin dari basis data. Periksa: apakah masuk akal, ada yang mubazir/tabrakan,
urutan masuk panci sudah benar, rasa bagaimana menyeimbangkannya, dan siapa yang tidak boleh minum.
JANGAN menambah tanaman di luar daftar. Jangan menjanjikan kesembuhan.
Racikan: ${JSON.stringify(ringkas)}
Bahasa jawaban: ${L}.
JSON: {"nama_usulan":"","nilai":"cocok|hati-hati|jangan","kenapa":"","perbaikan":[""],"rasa":"","siapa_jangan":[""],"jujur":""}`,
      {modelTier:'complex'});
    E('#nilaiAI').innerHTML=`<div class="kotak ${out.nilai==='cocok'?'baik':out.nilai==='jangan'?'bahaya':'awas'}" style="margin-top:10px">
      <b>🧠 ${esc(out.nama_usulan||'')}</b>
      <div style="margin-top:6px">${esc(out.kenapa||'')}</div>
      ${(out.perbaikan||[]).length?`<ul class="daftar">${out.perbaikan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
      ${out.rasa?`<div class="mini" style="margin-top:6px">👅 ${esc(out.rasa)}</div>`:''}
      ${(out.siapa_jangan||[]).length?`<div class="mini" style="margin-top:6px">⛔ ${out.siapa_jangan.map(esc).join(' · ')}</div>`:''}
      ${out.jujur?`<div class="mini" style="margin-top:6px">📌 ${esc(out.jujur)}</div>`:''}</div>`;
  }catch(e){E('#nilaiAI').innerHTML=`<div class="kotak bahaya">${esc(e&&e.message||'')}</div>`}
  b.disabled=false; b.innerHTML='🧠 '+t('periksa');
}
/* ---- Ngobrol: worker tanya balik ---- */
function vNgobrol(){
  E('#isi').innerHTML=`<div class="kotak"><b>💬 ${esc(t('ngobrolJ'))}</b>
      <div class="mini" style="margin-top:4px">${esc(t('wajib'))}</div></div>
    <div id="obrolan" class="obrolan"></div>
    <div class="kirimbar">
      <textarea id="pesan" rows="2" placeholder="${esc(t('ngobrolJ'))}"></textarea>
      <button class="btn utama" id="btnKirim">${esc(t('kirim'))}</button></div>`;
  gambarObrolan();
  E('#btnKirim').onclick=kirimPesan;
  E('#pesan').onkeydown=e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))kirimPesan()};
  siapkanFoto();
}
function gambarObrolan(){
  const k=E('#obrolan'); if(!k)return;
  k.innerHTML=OBROLAN.map(m=>m.peran==='saya'
    ? `<div class="gel saya">${m.gambar?`<img src="${m.gambar}" alt="" style="max-width:180px;border-radius:12px;display:block;margin-bottom:6px">`:''}${esc(m.teks)}</div>`
    : `<div class="gel worker">${esc(m.teks)}
        ${(m.kandidat||[]).length?`<div class="chips" style="margin-top:8px">${m.kandidat.map(s=>{
          const y=(m.yakin||[]).find(x=>x.slug===s);
          return PETA[s]?`<button type="button" class="chip" data-slug="${s}">🌿 ${esc(nm(PETA[s]))}${y?` <b style="opacity:.6">${esc(y.yakin)}</b>`:''}</button>`:''}).join('')}</div>`:''}
        ${m.siap?`<button class="btn utama" style="margin-top:8px" data-bawa="${esc((m.kandidat||[]).join(','))}">⚗️ ${esc(t('bawa'))}</button>`:''}
        ${(m.bahaya||[]).length?`<div class="kotak bahaya" style="margin-top:8px">⛔ ${m.bahaya.map(esc).join('<br>⛔ ')}</div>`:''}</div>`).join('');
  k.scrollTop=k.scrollHeight;
}
async function kirimPesan(){
  const inp=E('#pesan'), teks=(inp.value||'').trim(); if(!teks)return;
  OBROLAN.push({peran:'saya',teks}); inp.value=''; gambarObrolan();
  if(!await siapkanAI()){OBROLAN.push({peran:'worker',teks:t('aiMati')});gambarObrolan();return}
  const btn=E('#btnKirim'); btn.disabled=true; btn.innerHTML=`<span class="muat"></span>`;
  const semua=OBROLAN.filter(m=>m.peran==='saya').map(m=>m.teks).join(' | ');
  const daftar=kandidat(semua,26).map(p=>`${p.slug} | ${nm(p)} / ${p.binomial} | ${(p.khasiat||[]).slice(0,4).map(k=>k.keluhan+'('+k.bukti+')').join('; ')} | hamil:${p.aman_hamil} anak:${p.aman_anak} racun:${(p.racun||{}).status}`).join('\n');
  const turns=[{role:'user',content:`Kamu "worker herbal" Ocklu: ramah, jujur, tidak mendiagnosis penyakit berat.
Tugas: gali keluhan pemakai dengan BERTANYA BALIK satu pertanyaan penting tiap giliran
(sudah berapa lama, ada demam?, umur, hamil/menyusui?, obat rutin?, gejala penyerta, alergi).
Kalau muncul tanda bahaya (nyeri dada, sesak, muntah darah, kejang, demam >3 hari, bayi <2 tahun, hamil dengan perdarahan)
— langsung suruh ke dokter, jangan meracik.
Kalau keterangan sudah cukup (minimal lama sakit + tanda bahaya sudah ditanya), set "siap":true dan isi "kandidat"
dengan 3-6 slug dari katalog ini saja:
${daftar}

Riwayat obrolan:
${OBROLAN.map(m=>(m.peran==='saya'?'Pemakai: ':'Worker: ')+m.teks).join('\n')}

Bahasa jawaban: ${L}. Balas HANYA JSON:
{"balas":"kalimat hangat + pertanyaan berikutnya","siap":false,"kandidat":[],"bahaya":[],"ringkas_keluhan":""}`}];
  try{
    const out=await AI.json(turns,{modelTier:'complex'});
    OBROLAN.push({peran:'worker',teks:out.balas||'',siap:!!out.siap,kandidat:(out.kandidat||[]).filter(s=>PETA[s]),
      bahaya:out.bahaya||[],ringkas:out.ringkas_keluhan||''});
  }catch(e){OBROLAN.push({peran:'worker',teks:(e&&e.message)||t('aiMati')})}
  gambarObrolan();
  btn.disabled=false; btn.innerHTML=t('kirim');
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-bawa]');
  if(b){BAHAN=b.dataset.bawa.split(',').filter(s=>PETA[s]);simpan('oh_bahan',BAHAN);keTab('racik')}
});
/* ---- kenali tanaman dari foto (pakai mata AI di halaman) ---- */
async function siapkanFoto(){
  const tombol=E('#btnFoto'), berkas=E('#berkasFoto');
  if(!tombol||!berkas)return;
  if(!await siapkanAI())return;
  let caps=null;
  try{caps=AI.limits?await AI.limits():null}catch(e){caps=null}
  if(!caps||!caps.images)return;                       // tampilan ini tidak bisa kirim gambar
  if(caps.images.mediaTypes)berkas.accept=caps.images.mediaTypes.join(',');
  tombol.hidden=false;
  tombol.onclick=()=>berkas.click();
  berkas.onchange=()=>{const f=berkas.files&&berkas.files[0]; if(f)kenaliFoto(f)};
}
async function kenaliFoto(file){
  const url=URL.createObjectURL(file);
  OBROLAN.push({peran:'saya',teks:t('fotoKirim'),gambar:url}); gambarObrolan();
  const btn=E('#btnKirim'); if(btn){btn.disabled=true;btn.innerHTML='<span class="muat"></span>'}
  const katalog=D.tanaman.map(p=>`${p.slug}=${nm(p)}/${p.binomial}`).join('; ');
  try{
    const out=await AI.json(`Foto ini dikirim pemakai. Kenali tanamannya.
Cocokkan HANYA dengan katalog ini (pakai slug persis; kalau tidak ada yang cocok, kosongkan daftar):
${katalog}

Jawab jujur: kalau foto tidak jelas atau bukan tanaman, katakan begitu. Jangan menebak asal.
Bahasa: ${L}. JSON: {"lihat":"apa yang terlihat (daun, bunga, batang, warna)","kemungkinan":[{"slug":"","yakin":"tinggi|sedang|rendah","alasan":""}],"bukan_tanaman":false,"catatan":"peringatan kalau mirip tanaman beracun"}`,
      {images:[file],modelTier:'complex'});
    const sah=(out.kemungkinan||[]).filter(x=>PETA[x.slug]).slice(0,5);
    OBROLAN.push({peran:'worker',teks:(out.bukan_tanaman?t('fotoBukan')+' ':'')+(out.lihat||''),
      kandidat:sah.map(x=>x.slug), yakin:sah, bahaya:out.catatan?[out.catatan]:[], siap:sah.length>0});
  }catch(e){
    OBROLAN.push({peran:'worker',teks:(e&&e.code==='images_unavailable')?t('fotoTidakBisa'):((e&&e.message)||t('aiMati'))});
  }
  gambarObrolan();
  if(btn){btn.disabled=false;btn.innerHTML=t('kirim')}
}

/* ---- Ramuan klasik ---- */
function vRamuan(){
  E('#isi').innerHTML=`<div class="cari"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input id="qr" placeholder="${esc(t('cari'))}"></div><div class="kisi" id="kisiR"></div>`;
  const isi=()=>{
    const q=(E('#qr').value||'').toLowerCase();
    const d=D.ramuan.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q));
    E('#kisiR').innerHTML=d.map(x=>{const f=fotoRamuan(x);return `<button type="button" class="kartu" data-ramuan="${D.ramuan.indexOf(x)}">
      <div class="gbr">${f?`<img loading="lazy" src="${f}" alt="">`:`<div class="mono">📜</div>`}</div>
      <div class="teks"><h3>${esc(x['nama_'+L]||x.nama_id||x.nama_en||'')}</h3>
        <div class="lat">${esc((x.bahan||[]).slice(0,2).map(b=>b.tanaman).join(' · '))}</div>
        <div class="guna">${esc((x.untuk||[]).join(' · '))}</div>
        <span class="tag">⏱ ${esc(x.total_menit||'?')}′</span></div></button>`}).join('')
      ||`<div class="kosong">${esc(t('kosong'))}</div>`;
  };
  E('#qr').addEventListener('input',isi); isi();
}
/* ---- lembar rinci ---- */
const baris=(a,b)=>b?`<div class="baris"><b>${esc(a)}</b><span>${esc(b)}</span></div>`:'';
document.addEventListener('click',e=>{
  const k=e.target.closest('.kartu[data-slug]'); if(k)return buka(k.dataset.slug);
  const r=e.target.closest('[data-ramuan]'); if(r)return bukaRamuan(+r.dataset.ramuan);
});
function buka(slug){
  const p=PETA[slug]; if(!p)return;
  const N=p.nama||{};
  const namaDunia=[['🇮🇩','id'],['🇬🇧','en'],['🇨🇳','zh'],['🇯🇵','ja'],['🇰🇷','ko'],['🇷🇺','ru'],['🇩🇪','de'],['🇫🇷','fr'],['🇪🇸','es'],['🇸🇦','ar'],['🇮🇳','hi']]
    .filter(([,k])=>N[k]).map(([f,k])=>`<span class="tag">${f} ${esc(N[k])}</span>`).join(' ');
  const sb=(p.sebaran_nyata||{}).negara||[];
  const kb=kembar(slug,(p.iklim||[])[0]);
  const adaDiRacik=BAHAN.includes(slug);
  E('#lembarIsi').innerHTML=`
  <div class="tutup"><button class="btn" onclick="tutup()">✕</button>
    <button class="btn ${adaDiRacik?'utama':''}" data-b="${slug}">${adaDiRacik?'✓ '+esc(t('racik')||''):'+ '+esc(t('nav.racik'))}</button>
    <button class="btn" onclick="window.print()">🖨</button></div>
  <div class="sampul">${foto(p)?`<img src="${foto(p)}" alt="">`:''}
    <div class="nama"><h2>${esc(nm(p))}</h2><div class="lat">${esc(p.latin||p.binomial)} · ${esc(p.famili||'')}</div>
    <div>${(p.tradisi||[]).map(x=>`<span class="tag g">${esc(tr(x))}</span>`).join('')}
    ${(p.racun||{}).status==='ya-berbahaya'?`<span class="tag m">☠ ${esc(t('racun'))}</span>`:''}
    ${p.gambar_marga?`<span class="tag">📷 ${L==='id'?'foto se-marga':'genus photo'}</span>`:''}</div></div></div>
  <section class="blok"><h4>${esc(t('nama'))}</h4><div>${namaDunia}</div>
    ${(p.nama_lain||[]).length?`<div class="mini" style="margin-top:8px">${esc((p.nama_lain||[]).join(' · '))}</div>`:''}</section>
  <section class="blok"><h4>${esc(t('tempat'))}</h4><div class="kotak">
    ${baris(t('iklim'),(p.iklim||[]).map(tr).join(', '))}${baris('USDA',p.zona_usda)}${baris('mdpl',p.mdpl)}
    ${baris('°C',p.suhu_tumbuh)}${baris(L==='id'?'Asal':'Origin',p.asal_endemik)}
    ${baris('Indonesia',p.bisa_di_indonesia)}${baris(L==='id'?'Daerah lain':'Elsewhere',p.bisa_di_daerah_lain)}</div>
    ${sb.length?`<div class="kotak"><b class="mini">${esc(t('sebar'))} · GBIF ${(p.sebaran_nyata.total||0).toLocaleString()}</b>
      <div style="margin-top:7px">${sb.map(c=>`<span class="tag b">${esc(c.kode)} ${c.jumlah.toLocaleString()}</span>`).join('')}</div></div>`:''}</section>
  <section class="blok"><h4>${esc(t('isi'))}</h4>${(p.kandungan||[]).map(k=>
    `<div class="kotak"><b>${esc(tr(k.nama))}</b><div class="mini">${esc(k.fungsi)}</div></div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('guna'))}</h4>${(p.khasiat||[]).map(k=>
    `<div class="kotak"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <b>${esc(tr(k.keluhan))}</b><span class="mini">${bkt(k.bukti)}</span></div>
      <div class="mini">${esc(k.cara_kerja)}</div></div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('olah'))}</h4>${(p.olah||[]).map(o=>
    `<div class="kotak"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
      <b>${esc(tr(o.metode))}</b><span style="display:flex;gap:8px;align-items:center">
      <span class="menit">⏱ ${esc(o.menit)} ${esc(t('menit'))}</span>
      <button class="btn" data-timer="${parseInt(o.menit)||0}" data-nama="${esc(o.metode)}">▶</button></span></div>
      ${baris(t('bahan'),o.bahan)}${baris(L==='id'?'Air':'Water',o.air)}${baris('°C',o.suhu)}
      ${baris(t('hasil'),o.hasil)}${baris(t('dosis'),o.dosis)}${baris('Tips',o.tips)}</div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('simpan'))}</h4><div class="kotak">
    ${baris(L==='id'?'Wadah':'Container',(p.simpan||{}).wadah)}${baris('°C',(p.simpan||{}).suhu)}
    ${baris(L==='id'?'Tahan':'Shelf life',(p.simpan||{}).lama)}${baris(L==='id'?'Catatan':'Note',(p.simpan||{}).catatan)}</div></section>
  <section class="blok"><h4>${esc(t('plus'))} / ${esc(t('minus'))}</h4>
    <div class="kotak baik"><ul class="daftar">${(p.kelebihan||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'—'}</ul></div>
    <div class="kotak awas"><ul class="daftar">${(p.kekurangan||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'—'}</ul></div></section>
  <section class="blok"><h4>${esc(t('baik'))}</h4>${(p.campur_baik||[]).map(c=>
    `<div class="kotak baik"><b>+ ${esc(c.dengan)}</b><div class="mini">${esc(c.akibat)}</div></div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('bahaya'))}</h4>${(p.campur_bahaya||[]).map(c=>
    `<div class="kotak ${c.tingkat==='hindari'?'bahaya':'awas'}"><b>${c.tingkat==='hindari'?'⛔':'⚠'} ${esc(c.dengan)}</b>
     <span class="tag ${c.tingkat==='hindari'?'m':'g'}">${esc(tr(c.tingkat))}</span>
     <div class="mini">${esc(c.akibat)}</div></div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('obat'))}</h4>${(p.obat_kimia||[]).map(c=>
    `<div class="kotak ${c.tingkat==='hindari'?'bahaya':'awas'}"><b>💊 ${esc(c.obat)}</b>
     <span class="tag ${c.tingkat==='hindari'?'m':'g'}">${esc(tr(c.tingkat))}</span>
     <div class="mini">${esc(c.akibat)}</div></div>`).join('')||'—'}</section>
  <section class="blok"><h4>${esc(t('pantang'))}</h4><div class="kotak bahaya">
    <ul class="daftar">${(p.pantangan||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'—'}</ul>
    ${baris(t('aHamil'),tr(p.aman_hamil))}${baris(t('aAnak'),tr(p.aman_anak))}${baris('☠',(p.racun||{}).catatan)}</div></section>
  <section class="blok"><h4>${esc(t('tanam'))}</h4><div class="kotak">
    ${Object.entries(p.tanam||{}).map(([k,v])=>baris(k,v)).join('')||'—'}</div></section>
  ${kb.length?`<section class="blok"><h4>${esc(t('ganti'))}</h4><div class="kisi">${kb.map(x=>kartu(x.p)).join('')}</div></section>`:''}
  <section class="blok"><div class="kotak awas" style="font-size:12.5px">${esc(t('wajib'))}</div></section>`;
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
  const bt=E('#btnTerjemah');
  if(bt){
    const simpanan=muatLokal('oh_tj_'+slug+'_'+L,null);
    if(simpanan)pasangTerjemahan(simpanan);
    bt.onclick=()=>terjemahHalaman(slug);
  }
}
/* terjemahkan teks panjang di halaman rinci (sekali, lalu disimpan) */
function kumpulTeks(){
  const keluar=[];
  document.querySelectorAll('#lembarIsi .mini, #lembarIsi .baris span, #lembarIsi ul.daftar li').forEach(el=>{
    const s=(el.textContent||'').trim();
    if(s.length>3 && !/^[\d\s.,:%°\-\/]+$/.test(s))keluar.push(el);
  });
  return keluar;
}
function pasangTerjemahan(peta){
  kumpulTeks().forEach(el=>{
    const asli=(el.textContent||'').trim();
    if(peta[asli])el.textContent=peta[asli];
  });
}
async function terjemahHalaman(slug){
  const bt=E('#btnTerjemah'); if(!bt)return;
  if(!await siapkanAI()){bt.textContent='—';return}
  bt.disabled=true; bt.innerHTML='<span class="muat"></span>';
  const el=kumpulTeks();
  const unik=[...new Set(el.map(x=>(x.textContent||'').trim()))].slice(0,90);
  try{
    const out=await AI.json('Terjemahkan tiap nilai ke '+({en:'English',zh:'中文(简体)',ja:'日本語',ko:'한국어',ru:'Русский'}[L]||'English')+
      '. Pertahankan nama latin, angka, satuan (g, ml, menit, °C). Jangan menambah atau mengurangi makna.\n'+
      'Balas JSON objek dengan kunci angka yang sama:\n'+
      JSON.stringify(Object.fromEntries(unik.map((x,i)=>[i,x]))),{modelTier:'default'});
    const peta={};
    unik.forEach((x,i)=>{const v=out[String(i)]; if(typeof v==='string'&&v.trim())peta[x]=v});
    simpan('oh_tj_'+slug+'_'+L,peta);
    pasangTerjemahan(peta);
    bt.textContent='✓';
  }catch(e){bt.textContent='⚠'}
  bt.disabled=false;
}
function bukaRamuan(i){
  const x=D.ramuan[i]; if(!x)return;
  E('#lembarIsi').innerHTML=`
   <div class="tutup"><button class="btn" onclick="tutup()">✕</button><button class="btn" onclick="window.print()">🖨</button></div>
   <section class="blok" style="border:0">
     <span class="tag g">${esc(x.tradisi||'')}</span>${x.tanggal?`<span class="tag">${esc(x.tanggal)}</span>`:''}
     <h2 style="font-size:25px;margin:8px 0 3px">${esc(x['nama_'+L]||x.nama_id)}</h2>
     <div class="mini">${esc([x.nama_id,x.nama_en,x.nama_zh].filter(Boolean).join(' · '))}</div>
     <div style="margin-top:8px">${(x.untuk||[]).map(u=>`<span class="tag j">${esc(u)}</span>`).join('')}</div>
     ${x.kenapa_hari_ini?`<div class="kotak" style="margin-top:10px">🌅 ${esc(x.kenapa_hari_ini)}</div>`:''}</section>
   <section class="blok"><h4>${esc(t('bahan'))}</h4>${(x.bahan||[]).map(b=>{
     const p=PETA[b.slug]||D.tanaman.find(t=>t.binomial&&(b.tanaman||'').toLowerCase().includes(t.binomial.toLowerCase()));
     return `<button type="button" class="kartu lebar" ${p?`data-slug="${p.slug}"`:''}>
       <div class="gbr">${foto(p)?`<img loading="lazy" src="${foto(p)}" alt="">`:`<div class="mono">🌿</div>`}</div>
       <div class="teks"><h3>${esc(p?nm(p):b.tanaman)}</h3>
       <div class="lat">${esc(b.tanaman)}</div><div class="guna">${esc(b.takaran||'')} · ${esc(b.bagian||'')}</div></div></button>`}).join('')}</section>
   <section class="blok"><h4>${esc(t('olah'))}</h4>
     <button class="btn utama" style="width:100%;margin-bottom:10px" data-dapur="${encodeURIComponent(JSON.stringify(x.langkah||[]))}" data-judul="${esc(x.nama_id||'')}">👨‍🍳 ${esc(t('dapur'))}</button>
     ${(x.langkah||[]).map(s=>`<div class="langkah"><div class="no">${s.no}</div>
       <div style="flex:1">${esc(s.kerja)}${s.suhu?` <span class="mini">· ${esc(s.suhu)}</span>`:''}</div>
       ${s.menit?`<span class="menit">⏱ ${esc(s.menit)}′</span>`:''}</div>`).join('')}
     <div class="kotak" style="margin-top:10px">${baris(t('total'),(x.total_menit||'?')+' '+t('menit'))}${baris(t('hasil'),x.hasil)}${baris(t('dosis'),x.dosis)}${baris(L==='id'?'Rasa':'Taste',x.rasa)}</div></section>
   <section class="blok"><h4>${esc(t('simpan'))}</h4><div class="kotak">${Object.entries(x.simpan||{}).map(([k,v])=>baris(k,v)).join('')||'—'}</div></section>
   <section class="blok"><h4>${esc(t('pantang'))}</h4><div class="kotak bahaya">
     <ul class="daftar">${(x.hati_hati||[]).map(h=>`<li>⚠ ${esc(h)}</li>`).join('')}
     ${(x.jangan_dicampur||[]).map(h=>`<li>⛔ ${esc(h)}</li>`).join('')}</ul>
     <div class="mini" style="margin-top:8px">${esc(t('wajib'))}</div></div></section>`;
  E('#lembar').classList.add('buka'); E('#lembar').scrollTop=0; document.body.style.overflow='hidden';
}
function tutup(){E('#lembar').classList.remove('buka');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){tutup();dTutup()}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-timer]');
  if(b){e.stopPropagation();dMulaiSatu(parseInt(b.dataset.timer)||0,b.dataset.nama||'')}});
/* ---- mode dapur ---- */
let DL=[],DI=0,DJ=null,DJUDUL='';
const SUARA={id:'id-ID',en:'en-US',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR',ru:'ru-RU'};
function dBuka(langkah,judul){if(!langkah||!langkah.length)return;DL=langkah;DI=0;DJUDUL=judul||'';
  E('#dapur').classList.add('buka');document.body.style.overflow='hidden';dGambar()}
function dMulaiSatu(menit,nama){if(!menit)return;dBuka([{no:1,kerja:nama,menit}],nama);dTimer()}
function dGambar(){const s=DL[DI]||{};
  E('#dTahap').textContent=(DJUDUL?DJUDUL+' · ':'')+(DI+1)+'/'+DL.length;
  E('#dKerja').textContent=s.kerja||'';
  E('#dJam').textContent=s.menit?String(s.menit).padStart(2,'0')+':00':(s.suhu||'');
  E('#dMulai').style.display=s.menit?'':'none'; dSuara()}
function dGeser(n){clearInterval(DJ);DI=Math.max(0,Math.min(DL.length-1,DI+n));dGambar()}
function dTimer(){const s=DL[DI]||{};let sisa=(parseInt(s.menit)||0)*60;if(!sisa)return;clearInterval(DJ);
  const g=()=>E('#dJam').textContent=String(Math.floor(sisa/60)).padStart(2,'0')+':'+String(sisa%60).padStart(2,'0');
  g();DJ=setInterval(()=>{sisa--;g();if(sisa<=0){clearInterval(DJ);bunyi();E('#dJam').textContent='✓';
    if(DI<DL.length-1)setTimeout(()=>dGeser(1),1400)}},1000)}
function dSuara(){try{const s=DL[DI]||{};if(!s.kerja)return;speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(s.kerja+(s.menit?', '+s.menit+' '+t('menit'):''));
  u.lang=SUARA[L]||'id-ID';u.rate=.95;speechSynthesis.speak(u)}catch(e){}}
function dTutup(){clearInterval(DJ);try{speechSynthesis.cancel()}catch(e){}
  E('#dapur').classList.remove('buka');document.body.style.overflow=''}
function bunyi(){try{const c=new(window.AudioContext||window.webkitAudioContext)();
  [0,.25,.5].forEach(d=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
    o.frequency.value=880;g.gain.setValueAtTime(.001,c.currentTime+d);g.gain.exponentialRampToValueAtTime(.3,c.currentTime+d+.02);
    g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d+.22);o.start(c.currentTime+d);o.stop(c.currentTime+d+.25)})}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-dapur]');
  if(b){e.stopPropagation();try{dBuka(JSON.parse(decodeURIComponent(b.dataset.dapur)),b.dataset.judul)}catch(x){}}});
/* ---- AI ---- */
async function siapkanAI(){
  if(AI_SIAP)return !!AI;
  try{AI=await window.claude?.use?.('sample')}catch(e){AI=null}
  if(!AI){                       // dijalankan dari laptop sendiri -> pakai otak di server Ocklu
    try{
      const cek=await fetch('/api/status',{cache:'no-store'});
      if(cek.ok){
        AI={json:async(isi,opt)=>{
          const prompt=typeof isi==='string'?isi:(isi||[]).map(m=>m.content).join('\n');
          const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({prompt,maks:(opt&&opt.maks)||4000})});
          const d=await r.json();
          if(!d.ok)throw new Error(d.pesan||'otak mati');
          return d.hasil;
        }};
      }
    }catch(e){}
  }
  AI_SIAP=true; return !!AI;
}
/* ---- mode gelap/terang & ukuran huruf ---- */
const TEMA=()=>muatLokal('oh_tema','ikut');            // ikut perangkat | gelap | terang
function pasangTema(){
  const t=TEMA();
  if(t==='ikut')document.documentElement.removeAttribute('data-tema');
  else document.documentElement.setAttribute('data-tema',t);
  const b=E('#btnTema');
  if(b)b.textContent = t==='terang'?'☀️' : t==='gelap'?'🌙' : '🌗';
  if(typeof gambarPeta==='function' && E('#peta'))gambarPeta();
}
function gantiTema(){
  const urut=['ikut','gelap','terang'];
  const baru=urut[(urut.indexOf(TEMA())+1)%urut.length];
  simpan('oh_tema',baru); pasangTema();
}
const SKALA=()=>muatLokal('oh_skala',1);
function pasangSkala(){
  const s=SKALA();
  document.documentElement.style.setProperty('--skala',s);
  const b=E('#btnHuruf'); if(b)b.textContent = s<=1?'A+' : s<=1.15?'A++' : s<=1.3?'A+++' : 'A';
  if(typeof gambarPeta==='function' && E('#peta'))gambarPeta();
}
function gantiSkala(){
  const urut=[1,1.15,1.3,1.5];
  const baru=urut[(urut.indexOf(SKALA())+1)%urut.length];
  simpan('oh_skala',baru); pasangSkala();
}
pasangTema(); pasangSkala();
E('#btnTema').onclick=gantiTema;
E('#btnHuruf').onclick=gantiSkala;
E('#btnPremium').onclick=bukaPremium;
E('#btnSebar').onclick=bukaSebar;
disclaimerAwal();
E('#bhs').value=L;
gambarUlang();
siapkanAI();
