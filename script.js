// =============================================
// СВАДЕБНЫЙ САЙТ - ХАЧАТУР & ЮЛИЯ
// Интеграция с Google Sheets
// =============================================

(function() {
    // ========== КОНФИГУРАЦИЯ ==========
    // ⚠️ ЗАМЕНИТЕ ЭТОТ URL НА ВАШ URL ИЗ APPS SCRIPT ⚠️
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJAGrSvpJqkGRdWuU1-xfqSeIH0aQqD-KaNPoNy-TNLQ3xq0TD-6csa2QbBBo8kQRTUw/exec';
    
    let isSubmitting = false;
    
    // ========== БАЗОВЫЕ СТИЛИ АНИМАЦИЙ ==========
    const coreStyles = document.createElement('style');
    coreStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(coreStyles);
    
    // ========== УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО ==========
    function showModal(title, message, isError = false) {
        const existingModal = document.getElementById('customModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'customModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const icon = isError ? '✕' : '✓';
        const iconColor = isError ? '#c62828' : '#2e7d32';
        const bgIconColor = isError ? '#ffebee' : '#e8f5e9';
        const borderColor = isError ? '#c62828' : '#2e7d32';

        modal.innerHTML = `
            <div style="
                background: #ffffff;
                border-radius: 16px;
                padding: 32px 40px;
                max-width: 380px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.3s ease;
                border-top: 3px solid ${borderColor};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${bgIconColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px auto;
                ">
                    <div style="
                        font-size: 32px;
                        font-weight: 400;
                        color: ${iconColor};
                        line-height: 1;
                    ">${icon}</div>
                </div>
                <h3 style="
                    font-size: 24px;
                    font-weight: 500;
                    color: #1a1a1a;
                    margin-bottom: 12px;
                    letter-spacing: -0.3px;
                ">${title}</h3>
                <p style="
                    font-size: 16px;
                    color: #555555;
                    margin-bottom: 28px;
                    line-height: 1.5;
                ">${message}</p>
                <button onclick="this.closest('#customModal').remove()" style="
                    background: #f5f5f5;
                    color: #333333;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 40px;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                    Закрыть
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        if (!isError) {
            setTimeout(() => {
                if (modal.parentElement) modal.remove();
            }, 4000);
        }
    }
    
    // ========== МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ ==========
    function showLoadingModal() {
        const existingLoading = document.getElementById('loadingModal');
        if (existingLoading) existingLoading.remove();
        
        const loadingModal = document.createElement('div');
        loadingModal.id = 'loadingModal';
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px 40px;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #e0e0e0;
                    border-top-color: #2e2018;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="
                    font-size: 15px;
                    color: #2e2018;
                    margin: 0;
                    font-weight: 500;
                ">Отправка ответа...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);
        return loadingModal;
    }
    
    // ========== ОТПРАВКА В GOOGLE SHEETS ==========
    async function sendToGoogleSheets(formData) {
        const formBody = new URLSearchParams();
        formBody.append('name', formData.name);
        formBody.append('attendance', formData.attendance);
        formBody.append('guests', formData.guests);
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString()
        });
        
        const result = await response.json();
        return result;
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ФОРМЫ ==========
    function initRSVPForm() {
        const form = document.getElementById('rsvp-form');
        if (!form) return;
        
        // Находим элементы формы
        const nameInput = document.getElementById('name');
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        const guestsInput = document.getElementById('guests');
        const guestButtons = document.querySelectorAll('.guest-btn');
        const submitBtn = form.querySelector('.submit-btn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isSubmitting) return;
            
            // Получаем данные
            const name = nameInput ? nameInput.value.trim() : '';
            
            let attendance = null;
            attendanceRadios.forEach(radio => {
                if (radio.checked) attendance = radio.value;
            });
            
            const guests = guestsInput ? guestsInput.value : '1';
            
            // Валидация
            if (!name) {
                showModal('Ошибка', 'Пожалуйста, введите ваше имя', true);
                if (nameInput) nameInput.focus();
                return;
            }
            
            if (!attendance) {
                showModal('Ошибка', 'Пожалуйста, выберите, придете ли вы на свадьбу', true);
                return;
            }
            
            // Блокируем кнопку
            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }
            
            const loadingModal = showLoadingModal();
            
            try {
                const formData = { name, attendance, guests };
                const result = await sendToGoogleSheets(formData);
                
                loadingModal.remove();
                
                if (result.result === 'success') {
                    let responseMessage = '';
                    if (attendance === 'yes') {
                        responseMessage = `Спасибо, ${name}! Мы будем ждать вас на нашей свадьбе 5 сентября 2026 года! 🎉`;
                    } else {
                        responseMessage = `Спасибо за ответ, ${name}! Очень жаль, что вы не сможете быть с нами.`;
                    }
                    
                    // Показываем модальное окно успеха
                    showModal('Ответ отправлен!', responseMessage, false);
                    
                    // Очищаем форму
                    if (nameInput) nameInput.value = '';
                    attendanceRadios.forEach(radio => radio.checked = false);
                    
                    // Сбрасываем выбор количества гостей на 1
                    if (guestsInput) guestsInput.value = '1';
                    if (guestButtons) {
                        guestButtons.forEach(btn => btn.classList.remove('active'));
                        if (guestButtons.length > 0) {
                            guestButtons[0].classList.add('active');
                        }
                    }
                    
                    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                loadingModal.remove();
                showModal('Ошибка', error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.', true);
            } finally {
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ОТПРАВИТЬ ОТВЕТ';
                }
            }
        });
    }
    
    // ========== ЗАПУСК ==========
    document.addEventListener('DOMContentLoaded', () => {
        // Сохраняем существующие функции
        // Счетчик дней до свадьбы
        function updateCountdown() {
            const weddingDate = new Date('2026-09-05T15:00:00').getTime();
            const now = new Date().getTime();
            const timeLeft = weddingDate - now;
            
            if (timeLeft < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
        
        // Календарь
        function generateCalendar() {
            const calendarDays = document.getElementById('calendar-days');
            if (!calendarDays) return;
            
            calendarDays.innerHTML = '';
            
            const weddingDate = new Date(2026, 8, 5);
            const currentMonth = weddingDate.getMonth();
            const currentYear = weddingDate.getFullYear();
            
            const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                               'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
            const header = document.querySelector('.calendar-header h3');
            if (header) {
                header.textContent = monthNames[currentMonth] + ' ' + currentYear;
            }
            
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            
            let firstDayOfWeek = firstDay.getDay();
            firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
            
            const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
            
            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                const day = document.createElement('div');
                day.className = 'day other-month';
                day.textContent = prevMonthLastDay - i;
                calendarDays.appendChild(day);
            }
            
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const day = document.createElement('div');
                day.className = 'day';
                day.textContent = i;
                
                if (i === 5) {
                    day.className = 'day wedding-day';
                    day.title = 'День нашей свадьбы!';
                }
                
                calendarDays.appendChild(day);
            }
            
            const totalCells = 42;
            const daysSoFar = firstDayOfWeek + lastDay.getDate();
            const nextMonthDays = totalCells - daysSoFar;
            
            for (let i = 1; i <= nextMonthDays; i++) {
                const day = document.createElement('div');
                day.className = 'day other-month';
                day.textContent = i;
                calendarDays.appendChild(day);
            }
        }
        
        generateCalendar();
        
        // Управление выбором количества гостей
        const guestButtons = document.querySelectorAll('.guest-btn');
        const guestsInput = document.getElementById('guests');
        
        if (guestButtons.length > 0 && guestsInput) {
            guestButtons.forEach(button => {
                button.addEventListener('click', function() {
                    guestButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    guestsInput.value = this.getAttribute('data-value');
                });
            });
            // Активируем первый по умолчанию
            if (!document.querySelector('.guest-btn.active')) {
                guestButtons[0].classList.add('active');
            }
        }
        
        // Модальные окна
        const mapModal = document.getElementById('map-modal');
        const thankyouModal = document.getElementById('thankyou-modal');
        const openMapBtn = document.getElementById('open-map-btn');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        
        if (openMapBtn && mapModal) {
            openMapBtn.addEventListener('click', function() {
                mapModal.style.display = 'flex';
            });
        }
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (mapModal) mapModal.style.display = 'none';
                if (thankyouModal) thankyouModal.style.display = 'none';
            });
        });
        
        if (mapModal) {
            window.addEventListener('click', function(event) {
                if (event.target === mapModal) mapModal.style.display = 'none';
                if (event.target === thankyouModal) thankyouModal.style.display = 'none';
            });
        }
        
        // Инициализация формы с Google Sheets
        initRSVPForm();
        
        console.log('✅ Форма RSVP готова к отправке в Google Sheets');
    });
    
})();
