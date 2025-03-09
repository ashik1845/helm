// Navbar scroll background change
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Burger menu toggle for mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Leaflet Map with fixed height
    let map; // Declare the map variable globally
    const mapElement = document.getElementById('map');

    // Set a fixed height for the map container to avoid auto-height issues
    if (mapElement) {
        mapElement.style.height = '400px'; // Set your preferred fixed height
    }

    if (mapElement && !map) {
        map = L.map('map').setView([12.9716, 77.5946], 13); // Default location for the map

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Coordinates for bike and rider
        const bikeLocation = [12.92308859676093, 80.23986920081089]; // Example bike coordinates
        const riderLocation = [12.94309528162342, 80.23662431588261]; // Example rider coordinates

        // Add markers for bike and rider
        L.marker(bikeLocation).addTo(map)
            .bindPopup('<b>Bike Location</b><br>This is the current location of the bike.')
            .openPopup();

        L.marker(riderLocation).addTo(map)
            .bindPopup('<b>Rider Location</b><br>This is the current location of the rider.')
            .openPopup();
    }

    // Chart configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,  // Ensure the aspect ratio is maintained
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Chart default size management
    function fixChartSize(chartElement) {
        if (chartElement) {
            chartElement.style.height = '400px'; // Set the preferred height for charts
            chartElement.style.width = '100%';  // Set the chart width to be responsive
        }
    }

    // Initialize Accident Pie Chart
    const accidentCanvas = document.getElementById('accidentChart');
    fixChartSize(accidentCanvas);

    if (accidentCanvas) {
        const ctx = accidentCanvas.getContext('2d');
        const accidentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Died By Not Wearing Helmet', 'Died In Accident'],
                datasets: [{
                    label: 'Accident Statistics',
                    data: [22.9, 77.1], // Replace with your actual data
                    backgroundColor: ['#FF6F61', '#4CAF50'],
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                let label = tooltipItem.label || '';
                                if (tooltipItem.raw !== null) {
                                    label += `: ${tooltipItem.raw}%`;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize Rider Performance Line Chart
    const performanceCanvas = document.getElementById('performanceChart');
    fixChartSize(performanceCanvas);

    if (performanceCanvas) {
        const ctx = performanceCanvas.getContext('2d');
        const performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Trips',
                    data: [3, 5, 7, 10, 12, 15],
                    borderColor: '#FF6F61',
                    fill: false
                }, {
                    label: 'Helmet Compliance Rate (%)',
                    data: [88, 90, 85, 92, 94, 92],
                    borderColor: '#4CAF50',
                    fill: false
                }]
            },
            options: chartOptions
        });
    }

    // Upload form handling
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    document.getElementById('successMessage').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Maintenance Form Handling
    const maintenanceForm = document.getElementById('maintenanceForm');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const mileage = document.getElementById('mileage').value;
            const bikeModel = document.getElementById('bikeModel').value;

            // Logic to calculate next maintenance task based on mileage
            alert(`Next maintenance for ${bikeModel} at mileage ${parseInt(mileage) + 500} km (Oil Change)`);
        });
    }

    // Initialize Speed Analysis Line Chart
    const speedChartCanvas = document.getElementById('speedChart');
    fixChartSize(speedChartCanvas);

    if (speedChartCanvas) {
        const ctx1 = speedChartCanvas.getContext('2d');
        const speedChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Speed (km/h)',
                    data: [50, 60, 45, 80, 75, 85, 60],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });
    }

    // Initialize Helmet Compliance Doughnut Chart
    const helmetChartCanvas = document.getElementById('helmetChart');
    fixChartSize(helmetChartCanvas);

    if (helmetChartCanvas) {
        const ctx2 = helmetChartCanvas.getContext('2d');
        const helmetChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Helmet Worn', 'Helmet Not Worn'],
                datasets: [{
                    label: 'Helmet Compliance',
                    data: [85, 15],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: chartOptions
        });
    }
});

// Navbar scroll background change
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Burger menu toggle for mobile


burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Ensure DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Line Chart for Riding Habits
    const ctx = document.getElementById('ridingChart').getContext('2d');
    const ridingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Speed (km/h)',
                data: [60, 70, 80, 65, 75, 85, 90],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Initialize map
    const mapElement = document.getElementById('map');
    if (mapElement) {
        var map = L.map('map').setView([12.9716, 77.5946], 13); // Bangalore coordinates for demo

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Example accident-prone zones
        L.marker([12.9716, 77.5946]).addTo(map)
            .bindPopup('<b>Zone 1: Accident-Prone Area</b>')
            .openPopup();
        L.marker([12.9616, 77.5946]).addTo(map)
            .bindPopup('<b>Zone 2: Frequent Accident Area</b>')
            .openPopup();
    }
});
