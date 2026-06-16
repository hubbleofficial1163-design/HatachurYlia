document.addEventListener('DOMContentLoaded', function() {
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
        if (!calendarDays) {
            console.error('Элемент calendar-days не найден!');
            return;
        }
        
        calendarDays.innerHTML = '';
        
        const weddingDate = new Date(2026, 8, 5); // Сентябрь 2026 (месяцы с 0: 8 = сентябрь)
        const currentMonth = weddingDate.getMonth();
        const currentYear = weddingDate.getFullYear();
        
        // Обновляем заголовок
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
        
        // Дни предыдущего месяца
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'day other-month';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }
        
        // Дни текущего месяца
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
        
        // Дни следующего месяца
        const totalCells = 42;
        const daysSoFar = firstDayOfWeek + lastDay.getDate();
        const nextMonthDays = totalCells - daysSoFar;
        
        for (let i = 1; i <= nextMonthDays; i++) {
            const day = document.createElement('div');
            day.className = 'day other-month';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
        
        console.log('Календарь сгенерирован, дней:', calendarDays.children.length);
    }
    
    // Вызываем генерацию календаря
    generateCalendar();
    
    // Управление выбором количества гостей
    const guestButtons = document.querySelectorAll('.guest-btn');
    const guestsInput = document.getElementById('guests');
    
    if (guestButtons.length > 0) {
        guestButtons.forEach(button => {
            button.addEventListener('click', function() {
                guestButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                guestsInput.value = this.getAttribute('data-value');
            });
        });
        guestButtons[0].classList.add('active');
    }
    
    // Модальные окна
    const mapModal = document.getElementById('map-modal');
    const thankyouModal = document.getElementById('thankyou-modal');
    const openMapBtn = document.getElementById('open-map-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (openMapBtn) {
        openMapBtn.addEventListener('click', function() {
            if (mapModal) mapModal.style.display = 'flex';
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
            if (event.target === mapModal) {
                mapModal.style.display = 'none';
            }
            if (event.target === thankyouModal) {
                thankyouModal.style.display = 'none';
            }
        });
    }
    
    // Обработка формы
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            rsvpForm.reset();
            
            guestButtons.forEach(btn => btn.classList.remove('active'));
            if (guestButtons.length > 0) {
                guestButtons[0].classList.add('active');
            }
            if (guestsInput) guestsInput.value = "1";
            
            if (thankyouModal) thankyouModal.style.display = 'flex';
        });
    }
});