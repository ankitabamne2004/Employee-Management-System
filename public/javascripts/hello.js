function openCalendar(event, ename, employeeId) {
    const calendarPopup = document.getElementById('calendarPopup');
    calendarPopup.style.display = 'block';
    

    const links = document.querySelectorAll('.atag');
    links.forEach(link => {
        const month = link.getAttribute('data-month');
        const year = link.getAttribute('data-year');
        link.setAttribute('href', `/admin/add-payhead/${month}/${year}/${employeeId}/${ename}`);

        // Check the status for each month
        fetch(`/api/payroll-status/${employeeId}/${month}/${year}`)
            .then(response => response.json())
            .then(data => {
                const statusSpan = link.querySelector('.status');
                if (data.status === 'processed') {
                    statusSpan.textContent = 'Processed';
                } else {
                    statusSpan.textContent = 'Not Processed';
                    statusSpan.style.color = '#4CAF50'; // Green color for not processed
                }
            })
            .catch(error => console.error('Error fetching payroll status:', error));
    });

    // Attach click event to hide the popup
    document.addEventListener('click', function hidePopup(e) {
        if (!calendarPopup.contains(e.target) && e.target !== event.target) {
            calendarPopup.style.display = 'none';
            document.removeEventListener('click', hidePopup);
        }
    });
}
