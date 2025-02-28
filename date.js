
document.addEventListener('DOMContentLoaded', function() {
    const timeElement = document.getElementById('current-time');
    
    if (timeElement) {
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
});