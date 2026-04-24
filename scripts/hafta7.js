/**
 * hafta7.js
 * Hafta 7 – Bootstrap + JavaScript Laboratuvarı
 * ------------------------------------------------
 * İçerik:
 *   1. Tema Yönetimi  – toggleTheme(), applyTheme()
 *   2. Form Yönetimi  – validateForm(), handleFormSubmit()
 *   3. Özet Üretimi   – generateSummaryCard()
 *   4. Form Sıfırlama – resetForm()
 *   5. Sayfa Yüklendiğinde başlangıç kurulumu
 */

'use strict'; // ES6 strict mode

/* ============================================================
   1. TEMA YÖNETİMİ
   Bootstrap'in data-bs-theme özelliği ile light/dark geçişi
   ============================================================ */

/**
 * Mevcut temayı LocalStorage'a kaydeder ve sayfa üzerinde uygular.
 * @param {string} theme - 'light' veya 'dark'
 */
const applyTheme = (theme) => {
    // Bootstrap tema özelliğini HTML köküne uygula
    document.documentElement.setAttribute('data-bs-theme', theme);

    const themeIcon  = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    if (theme === 'dark') {
        // Koyu tema aktifken ikonu ve etiketi güncelle
        themeIcon.className  = 'bi bi-sun-fill';
        themeLabel.textContent = 'Açık Temaya Geç';
    } else {
        // Açık tema aktifken ikonu ve etiketi güncelle
        themeIcon.className  = 'bi bi-moon-stars-fill';
        themeLabel.textContent = 'Koyu Temaya Geç';
    }

    // Seçimi tarayıcı oturumları arasında koru
    localStorage.setItem('wplab-theme', theme);
};

/**
 * Aktif temayı light ↔ dark arasında değiştirir.
 * Navbar'daki ve Hero bölümündeki butonlar bu fonksiyonu çağırır.
 */
const toggleTheme = () => {
    // Mevcut tema değerini oku
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') ?? 'light';
    // Karşı temayı hesapla
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
};

/* ============================================================
   2. FORM DOĞRULAMA (VALIDATION)
   Bootstrap's is-invalid / is-valid sınıflarıyla görsel geri bildirim
   ============================================================ */

/**
 * Belirli bir form elemanının geçerli olup olmadığını kontrol eder,
 * Bootstrap doğrulama sınıflarını ekler veya kaldırır.
 *
 * @param {HTMLElement} field  - Kontrol edilecek form elemanı
 * @param {boolean}     valid  - Geçerli mi?
 */
const setValidity = (field, valid) => {
    field.classList.toggle('is-valid',   valid);
    field.classList.toggle('is-invalid', !valid);
};

/**
 * Tüm form alanlarını doğrular.
 * Boş alan ve geçersiz e-posta gibi temel kontroller yapılır.
 *
 * @returns {boolean} Tüm alanlar geçerliyse true, değilse false
 */
const validateForm = () => {
    const fullName      = document.getElementById('fullName');
    const email         = document.getElementById('email');
    const department    = document.getElementById('department');
    const classYear     = document.getElementById('classYear');
    const sessionSelect = document.getElementById('sessionSelect');
    const attendanceType= document.getElementById('attendanceType');
    const consentCheck  = document.getElementById('consentCheck');

    // E-posta biçimi için basit RegEx
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Her alanı ayrı ayrı doğrula
    const isNameValid     = fullName.value.trim().length >= 2;
    const isEmailValid    = emailRegex.test(email.value.trim());
    const isDeptValid     = department.value.trim().length >= 2;
    const isClassValid    = classYear.value !== '';
    const isSessionValid  = sessionSelect.value !== '';
    const isAttendValid   = attendanceType.value !== '';
    const isConsentValid  = consentCheck.checked;

    // Bootstrap görsel geri bildirimlerini uygula
    setValidity(fullName,       isNameValid);
    setValidity(email,          isEmailValid);
    setValidity(department,     isDeptValid);
    setValidity(classYear,      isClassValid);
    setValidity(sessionSelect,  isSessionValid);
    setValidity(attendanceType, isAttendValid);
    setValidity(consentCheck,   isConsentValid);

    // Tüm koşullar sağlanıyorsa true döndür
    return (
        isNameValid &&
        isEmailValid &&
        isDeptValid &&
        isClassValid &&
        isSessionValid &&
        isAttendValid &&
        isConsentValid
    );
};

/* ============================================================
   3. ÖZET KARTI OLUŞTURMA
   Template Literals ile temiz HTML enjeksiyonu
   ============================================================ */

/**
 * Form verilerini alarak Bootstrap Card formatında özet HTML üretir
 * ve #resultArea içine enjekte eder.
 *
 * @param {Object} data - Form alanlarından alınan değerleri içeren nesne
 */
const generateSummaryCard = (data) => {
    // Özet oluşturulma zaman damgası
    const now = new Date();
    const timestamp = now.toLocaleString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // Template literal ile tam HTML yapısı
    const cardHTML = `
        <div class="card border-0 shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center py-3">
                <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-person-check-fill text-success me-2"></i>Başvuru Özeti
                </h5>
                <span class="badge text-bg-success px-3 py-2">
                    <i class="bi bi-check2-circle me-1"></i>Oluşturuldu
                </span>
            </div>

            <div class="card-body p-4">
                <div class="row g-4">
                    <!-- Kişisel Bilgiler -->
                    <div class="col-md-6">
                        <h6 class="text-secondary fw-semibold mb-3 text-uppercase small letter-spacing-wide">
                            <i class="bi bi-person me-1"></i>Kişisel Bilgiler
                        </h6>
                        <div class="summary-row">
                            <span class="summary-label">Ad Soyad</span>
                            <span class="summary-value fw-medium">${escapeHTML(data.fullName)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">E-posta</span>
                            <span class="summary-value">
                                <a href="mailto:${escapeHTML(data.email)}" class="text-decoration-none">
                                    ${escapeHTML(data.email)}
                                </a>
                            </span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Bölüm</span>
                            <span class="summary-value">${escapeHTML(data.department)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Sınıf</span>
                            <span class="summary-value">${escapeHTML(data.classYear)}</span>
                        </div>
                    </div>

                    <!-- Etkinlik Bilgileri -->
                    <div class="col-md-6">
                        <h6 class="text-secondary fw-semibold mb-3 text-uppercase small">
                            <i class="bi bi-calendar-event me-1"></i>Etkinlik Tercihleri
                        </h6>
                        <div class="summary-row">
                            <span class="summary-label">Oturum</span>
                            <span class="badge text-bg-primary">${escapeHTML(data.session)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Katılım Türü</span>
                            <span class="badge text-bg-info text-dark">${escapeHTML(data.attendanceType)}</span>
                        </div>
                        ${data.notes ? `
                        <div class="summary-row flex-column align-items-start gap-1 mt-2">
                            <span class="summary-label">Kısa Mesaj</span>
                            <p class="small text-secondary mb-0 fst-italic">"${escapeHTML(data.notes)}"</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>

            <div class="card-footer text-end text-secondary small py-2">
                <i class="bi bi-clock me-1"></i>Oluşturuldu: ${timestamp}
            </div>
        </div>
    `;

    // Sonuç alanına enjekte et
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = cardHTML;

    // Kullanıcıyı sonuca kaydır
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * XSS koruması için kullanıcı girdisindeki özel HTML karakterlerini kaçış işaretine çevirir.
 * @param {string} str - İşlenecek metin
 * @returns {string} Güvenli HTML metni
 */
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

/* ============================================================
   4. FORM GÖNDERME İŞLEYİCİSİ
   event.preventDefault() ile varsayılan gönderimi engeller
   ============================================================ */

/**
 * Form submit olayını yakalar, doğrular ve özet üretir.
 * @param {Event} event - Submit olayı
 */
const handleFormSubmit = (event) => {
    // Varsayılan form gönderimini engelle (sayfa yenilenmez)
    event.preventDefault();

    // Tüm alanları doğrula
    const isValid = validateForm();

    if (!isValid) {
        // Geçersiz form: uyarı göster ve dur
        return;
    }

    // Form verilerini oku
    const formData = {
        fullName:       document.getElementById('fullName').value.trim(),
        email:          document.getElementById('email').value.trim(),
        department:     document.getElementById('department').value.trim(),
        classYear:      document.getElementById('classYear').value,
        session:        document.getElementById('sessionSelect').value,
        attendanceType: document.getElementById('attendanceType').value,
        notes:          document.getElementById('notes').value.trim(),
    };

    // Başvuru özet kartını oluştur ve ekrana yaz
    generateSummaryCard(formData);
};

/* ============================================================
   5. FORMU SIFIRLAMA
   ============================================================ */

/**
 * Formdaki tüm alanları temizler, Bootstrap doğrulama sınıflarını kaldırır
 * ve sonuç alanını başlangıç durumuna döndürür.
 */
const resetForm = () => {
    const form = document.getElementById('registrationForm');
    form.reset();

    // Tüm is-valid / is-invalid sınıflarını temizle
    form.querySelectorAll('.is-valid, .is-invalid').forEach((el) => {
        el.classList.remove('is-valid', 'is-invalid');
    });

    // Sonuç alanını başlangıç mesajına döndür
    document.getElementById('resultArea').innerHTML = `
        <div class="alert alert-info d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-info-circle-fill"></i>
            <span>Henüz başvuru özeti oluşturulmadı. Formu doldurduktan sonra sonuç burada görünecek.</span>
        </div>
    `;
};

/* ============================================================
   6. SAYFA YÜKLENME – BAŞLANGIÇ KURULUMU
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 6a. Tema: LocalStorage'dan kayıtlı tercih varsa uygula ---
    const savedTheme = localStorage.getItem('wplab-theme') ?? 'light';
    applyTheme(savedTheme);

    // --- 6b. Form submit olayını bağla ---
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // --- 6c. Anlık e-posta doğrulaması (input olayı) ---
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', () => {
            // Kullanıcı yazdıkça e-posta alanını anlık kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value.trim() !== '') {
                setValidity(emailField, emailRegex.test(emailField.value.trim()));
            } else {
                // Boşsa sınıfları kaldır
                emailField.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
});
