function updateTemperature() {
  const tempElement = document.getElementById('room-temperature');
  // Simulate temperature update
  const simulatedTemperature = "22.5";
  tempElement.textContent = `${simulatedTemperature}°C`;
}

// Control light
const lightToggle = document.getElementById('light-toggle');
lightToggle.addEventListener('change', function () {
  if (this.checked) {
    document.getElementById('light-status-text').textContent = 'Turned On';
  } else {
    document.getElementById('light-status-text').textContent = 'Turned Off';
  }
});

// Periodically update temperature
setInterval(updateTemperature, 5000);

const lightStatusDot = document.getElementById('light-status-dot');
const lightStatus = document.querySelector('.light-status');

lightToggle.addEventListener('change', function() {
    if (this.checked) {
        lightStatusDot.classList.add('on');
        lightStatus.classList.add('on');
    } else {
        lightStatusDot.classList.remove('on');
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
