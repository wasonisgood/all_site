document.addEventListener('DOMContentLoaded', function() {
    let budgetData = [];
    const years = ['111', '112', '113', '114'];

    // 加載數據
    Promise.all(years.map(year =>
        fetch(`${year}.json`).then(response => response.json())
    )).then(data => {
        budgetData = data;
        initializePage();
    }).catch(error => console.error('Error loading data:', error));

    function initializePage() {
        setupTabs();
        renderOverview();
        renderDetails();
        renderTrend();
        renderStackedBudget();
        renderItemTrends();
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }

    function renderOverview() {
        const ctx = document.getElementById('yearlyBudgetChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: '總預算',
                    data: budgetData.map(getTotalBudget),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderDetails() {
        const detailsContainer = document.getElementById('budgetDetails');
        budgetData.forEach((yearData, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${years[index]}年度預算明細</h3>
                <table>
                    <thead>
                        <tr>
                            <th>科目名稱</th>
                            <th>預算數</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${getBudgetBreakdown(yearData).map(item => `
                            <tr>
                                <td>${item.科目名稱}</td>
                                <td>${item.預算數.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            detailsContainer.appendChild(card);
        });
    }

    function renderTrend() {
        const ctx = document.getElementById('budgetTrendChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '總預算趨勢',
                    data: budgetData.map(getTotalBudget),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderStackedBudget() {
        const ctx = document.getElementById('stackedBudgetChart').getContext('2d');
        const allItems = getAllBudgetItems();
        const datasets = allItems.map((item, index) => ({
            label: item,
            data: budgetData.map(yearData => getBudgetItemAmount(yearData, item)),
            backgroundColor: getColor(index),
        }));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        });
    }

    function renderItemTrends() {
        const container = document.getElementById('itemTrendsContainer');
        container.innerHTML = ''; // 清空容器
        const validItems = getValidBudgetItems();
        
        validItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'trend-card';
            
            const canvas = document.createElement('canvas');
            card.appendChild(canvas);
            container.appendChild(card);
            
            const ctx = canvas.getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: years,
                    datasets: [{
                        label: item,
                        data: budgetData.map(yearData => getBudgetItemAmount(yearData, item)),
                        backgroundColor: getColor(validItems.indexOf(item)),
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: item
                        }
                    }
                }
            });
        });
    }

    function getTotalBudget(data) {
        if (!data || !data['預算編製_單位預算書表'] || !data['預算編製_單位預算書表']['報表資料列組'] || !data['預算編製_單位預算書表']['報表資料列組']['報表資料列']) {
            console.error('Invalid data structure:', data);
            return 0;
        }
        return data['預算編製_單位預算書表']['報表資料列組']['報表資料列'].reduce((total, row) => {
            const budget = parseInt(row['預算數']);
            return isNaN(budget) ? total : total + budget;
        }, 0);
    }

    function getBudgetBreakdown(data) {
        if (!data || !data['預算編製_單位預算書表'] || !data['預算編製_單位預算書表']['報表資料列組'] || !data['預算編製_單位預算書表']['報表資料列組']['報表資料列']) {
            console.error('Invalid data structure:', data);
            return [];
        }
        return data['預算編製_單位預算書表']['報表資料列組']['報表資料列'].filter(row => row['預算數'] && row['預算數'] !== "").map(row => ({
            科目名稱: row['名稱及編號'],
            預算數: parseInt(row['預算數']) || 0
        }));
    }

    function getAllBudgetItems() {
        const items = new Set();
        budgetData.forEach(yearData => {
            yearData['預算編製_單位預算書表']['報表資料列組']['報表資料列'].forEach(row => {
                if (row['預算數'] && row['預算數'] !== "") {
                    items.add(row['名稱及編號']);
                }
            });
        });
        return Array.from(items);
    }

    function getValidBudgetItems() {
        const itemCounts = {};
        budgetData.forEach(yearData => {
            yearData['預算編製_單位預算書表']['報表資料列組']['報表資料列'].forEach(row => {
                if (row['預算數'] && row['預算數'] !== "") {
                    itemCounts[row['名稱及編號']] = (itemCounts[row['名稱及編號']] || 0) + 1;
                }
            });
        });
        return Object.keys(itemCounts).filter(item => itemCounts[item] >= 2);
    }

    function getBudgetItemAmount(yearData, item) {
        const row = yearData['預算編製_單位預算書表']['報表資料列組']['報表資料列'].find(row => row['名稱及編號'] === item);
        return row ? parseInt(row['預算數']) || 0 : 0;
    }

    function getColor(index) {
        const colors = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
        ];
        return colors[index % colors.length];
    }
});