document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const googleSearchLink = document.getElementById('googleSearchLink');
    const remainingCountriesCount = document.getElementById('remainingCountriesCount');

    const existingCountries = countries.map(country => country.name);
    const remainingCountries = countryList.filter(country => !existingCountries.includes(country.chinese));

    remainingCountriesCount.textContent = `還有 ${remainingCountries.length} 個國家沒有資料`;

    remainingCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.chinese;
        option.textContent = country.chinese;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener('change', function() {
        const selectedCountry = countryList.find(country => country.chinese === this.value);
        const googleSearchUrl = `https://www.google.com/search?q="${encodeURIComponent(selectedCountry.english)}"+"death penalty for mentally ill"`;
        googleSearchLink.href = googleSearchUrl;
    });

    function renderCountryTable() {
        const tableBody = document.getElementById('countryTableBody');
        tableBody.innerHTML = '';
        countries.forEach(country => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2 border-b">${country.name}</td>
                <td class="px-4 py-2 border-b">${country.status}</td>
                <td class="px-4 py-2 border-b">${country.deathPenaltyStatus}</td>
                <td class="px-4 py-2 border-b">${country.additionalInfo.substring(0, 10)}...</td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById('updateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const country = {
            name: document.getElementById('country').value,
            status: document.getElementById('status').value,
            deathPenaltyStatus: document.getElementById('deathPenaltyStatus').value,
            additionalInfo: document.getElementById('additionalInfo').value
        };
        const existingIndex = countries.findIndex(c => c.name === country.name);
        if (existingIndex !== -1) {
            countries[existingIndex] = country;
        } else {
            countries.push(country);
        }
        localStorage.setItem('countries', JSON.stringify(countries));
        renderCountryTable();
        updateCharts();
        this.reset();
        remainingCountriesCount.textContent = `還有 ${remainingCountries.length - countries.length} 個國家沒有資料`;
    });

    document.getElementById('deathPenaltyStatus').addEventListener('change', function() {
        const statusDiv = document.getElementById('statusDiv');
        if (this.value === '廢除' || this.value === '實質廢除') {
            statusDiv.style.display = 'none';
        } else {
            statusDiv.style.display = 'block';
        }
    });

    function initCharts() {
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        const deathPenaltyCtx = document.getElementById('deathPenaltyChart').getContext('2d');

        window.statusChart = new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['執行', '不執行'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#FF6384', '#36A2EB']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: '對精神疾病患者執行死刑的國家比例'
                }
            }
        });

        window.deathPenaltyChart = new Chart(deathPenaltyCtx, {
            type: 'pie',
            data: {
                labels: ['保留', '廢除', '實質廢除'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: '各國死刑狀態比例'
                }
            }
        });
    }

    function updateCharts() {
        const statusData = countries.reduce((acc, country) => {
            acc[country.status === '是' ? 0 : 1]++;
            return acc;
        }, [0, 0]);

        const deathPenaltyData = countries.reduce((acc, country) => {
            if (country.deathPenaltyStatus === '保留') acc[0]++;
            else if (country.deathPenaltyStatus === '廢除') acc[1]++;
            else if (country.deathPenaltyStatus === '實質廢除') acc[2]++;
            return acc;
        }, [0, 0, 0]);

        window.statusChart.data.datasets[0].data = statusData;
        window.statusChart.update();

        window.deathPenaltyChart.data.datasets[0].data = deathPenaltyData;
        window.deathPenaltyChart.update();
    }

    renderCountryTable();
    initCharts();
    updateCharts();

    const worldMap = L.map('worldMap').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(worldMap);

    function addMarkers() {
        countries.forEach((country, index) => {
            setTimeout(() => {
                fetch(`https://nominatim.openstreetmap.org/search?country=${country.name}&format=json&limit=1`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok (${response.status}): ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.length > 0) {
                            const { lat, lon } = data[0];
                            console.log(`Country: ${country.name}, Lat: ${lat}, Lon: ${lon}`); // 調試訊息
                            let color = country.deathPenaltyStatus === '廢除' ? 'gray' : (country.deathPenaltyStatus === '實質廢除' ? 'yellow' : 'red');
                            let marker = L.circleMarker([lat, lon], {
                                color: color,
                                radius: 8,
                                fillOpacity: 0.8
                            }).addTo(worldMap);
                            marker.bindPopup(`<b>${country.name}</b><br>${country.additionalInfo}`);
                        } else {
                            console.warn(`No data found for country: ${country.name}`);
                        }
                    })
                    .catch(error => console.error('Fetch error:', error));
            }, index * 1000); // 每次請求間隔 1 秒
        });
    }

    addMarkers();
});
