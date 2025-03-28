function updateTemperature() {
    const tempElement = document.getElementById('room-temperature');
    const currentTemp = parseFloat(tempElement.textContent);
    const randomTemp = (Math.random() * (24 - 18) + 18).toFixed(1); // Random temp between 18 and 24
    
    tempElement.style.transform = 'scale(1.1)';
    tempElement.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        tempElement.textContent = `${randomTemp}°C`;
        tempElement.style.transform = 'scale(1)';
    }, 150);
}

setInterval(updateTemperature, 5000);

const lightToggle = document.getElementById('light-toggle');
const lightStatusDot = document.getElementById('light-status-dot');
const lightStatusText = document.getElementById('light-status-text');
const lightStatus = document.querySelector('.light-status');

lightToggle.addEventListener('change', function() {
    if (this.checked) {
        lightStatusDot.classList.add('on');
        lightStatusText.textContent = 'Turned On';
        lightStatus.classList.add('on');
    } else {
        lightStatusDot.classList.remove('on');
        lightStatusText.textContent = 'Turned Off';
        lightStatus.classList.remove('on');
    }
});

const scheduleTimeInput = document.getElementById('schedule-time');
const scheduleActionSelect = document.getElementById('schedule-action');
const addScheduleBtn = document.getElementById('add-schedule-btn');
const scheduleItems = document.getElementById('schedule-items');
const scheduleForm = document.getElementById('schedule-form');
const toggleScheduleForm = document.getElementById('toggle-schedule-form');

toggleScheduleForm.addEventListener('click', () => {
    const isHidden = !scheduleForm.classList.contains('show');
    
    if (isHidden) {
        scheduleForm.style.display = 'block';
        // Force reflow
        scheduleForm.offsetHeight;
        scheduleForm.classList.add('show');
        toggleScheduleForm.innerHTML = '<i class="fas fa-times"></i><span>Cancel</span>';
    } else {
        scheduleForm.classList.remove('show');
        setTimeout(() => {
            scheduleForm.style.display = 'none';
            toggleScheduleForm.innerHTML = '<i class="fas fa-plus"></i><span>New Schedule</span>';
        }, 300);
    }
});

addScheduleBtn.addEventListener('click', () => {
    const time = scheduleTimeInput.value;
    const action = scheduleActionSelect.value;

    if (time) {
        addScheduleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addScheduleBtn.style.transform = 'scale(1)';
        }, 100);

        const listItem = document.createElement('li');
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateY(20px)';
        
        const actionIcon = action === 'on' ? 'fa-lightbulb' : 'fa-power-off';
        listItem.innerHTML = `
            <div class="schedule-item-content">
                <i class="fas ${actionIcon}"></i>
                <span>${formatTime(time)} - ${action === 'on' ? 'Turn On' : 'Turn Off'}</span>
            </div>
            <button onclick="removeScheduleItem(this)" title="Remove Schedule">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        scheduleItems.appendChild(listItem);
        
        setTimeout(() => {
            listItem.style.opacity = '1';
            listItem.style.transform = 'translateY(0)';
        }, 50);

        scheduleTimeInput.value = '';
        scheduleActionSelect.selectedIndex = 0;
        
        // Reset form state properly
        scheduleForm.classList.remove('show');
        setTimeout(() => {
            scheduleForm.style.display = 'none';
            toggleScheduleForm.innerHTML = '<i class="fas fa-plus"></i><span>New Schedule</span>';
        }, 300);
    }
});

function removeScheduleItem(button) {
    const listItem = button.parentElement;
    listItem.style.opacity = '0';
    listItem.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        listItem.remove();
    }, 300);
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
}

scheduleItems.addEventListener('mouseover', (e) => {
    const listItem = e.target.closest('li');
    if (listItem) {
        listItem.style.transform = 'translateX(4px)';
    }
});

scheduleItems.addEventListener('mouseout', (e) => {
    const listItem = e.target.closest('li');
    if (listItem) {
        listItem.style.transform = 'translateX(0)';
    }
});