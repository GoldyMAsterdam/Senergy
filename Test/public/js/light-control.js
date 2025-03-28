document.addEventListener('DOMContentLoaded', function() {
    const lightToggleBtn = document.getElementById('light-toggle-btn');
    const lightStatusDot = document.getElementById('light-status-dot');
    const lightStatusText = document.getElementById('light-status-text');
    
    // Function to update light state
    function updateLightState(state) {
        lightStatusDot.className = 'status-dot ' + (state === 'ON' ? 'on' : 'off');
        lightStatusText.textContent = state === 'ON' ? 'Turned On' : 'Turned Off';
    }
    
    // Function to toggle light
    async function toggleLight() {
        try {
            const response = await fetch('light-control.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: lightStatusText.textContent.includes('Off') ? 'ON' : 'OFF'
                })
            });
            
            const data = await response.json();
            if (data.success) {
                updateLightState(data.state);
            }
        } catch (error) {
            console.error('Error toggling light:', error);
        }
    }
    
    // Add click event listener to toggle button
    if (lightToggleBtn) {
        lightToggleBtn.addEventListener('click', toggleLight);
    }
    
    // Poll for light state changes
    setInterval(async () => {
        try {
            const response = await fetch('light-control.php');
            const data = await response.json();
            updateLightState(data.state);
        } catch (error) {
            console.error('Error polling light state:', error);
        }
    }, 1000);
}); 