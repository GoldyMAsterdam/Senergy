// Theme
const themeSelect = document.getElementById('theme');
themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});

// lang
const languageSelect = document.getElementById('language');
languageSelect.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    localStorage.setItem('language', selectedLanguage);
    console.log(`Language changed to: ${selectedLanguage}`);
});

// Timezone
const timezoneSelect = document.getElementById('timezone');
timezoneSelect.addEventListener('change', (e) => {
    const selectedTimezone = e.target.value;
    localStorage.setItem('timezone', selectedTimezone);
    updateCurrentTime(selectedTimezone);
});

function updateCurrentTime(timezone) {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    const options = { 
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    
    timeElement.textContent = now.toLocaleTimeString('en-US', options);
}

function initializeSettings() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    themeSelect.value = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);

    
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;

    const savedTimezone = localStorage.getItem('timezone') || 'CET';
    timezoneSelect.value = savedTimezone;
    updateCurrentTime(savedTimezone);
}

// Call initialization when the page loads
document.addEventListener('DOMContentLoaded', initializeSettings); 