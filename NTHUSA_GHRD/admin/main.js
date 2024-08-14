document.addEventListener('DOMContentLoaded', () => {
    // Load data for various pages
    loadContactInfo();
    loadStaffData();
    loadArticlesData();
    loadEventsData();
    loadRegulationsData();
    loadQAData();

    // Add event listeners for form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

function loadContactInfo() {
    fetch('/api/contact')
        .then(response => response.json())
        .then(data => {
            const contactTableBody = document.getElementById('contact-table-body');
            if (contactTableBody) {
                contactTableBody.innerHTML = '';
                data.forEach(contact => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.message}</td>
                    `;
                    contactTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading contact info:', error));
}

function loadStaffData() {
    fetch('/api/staff')
        .then(response => response.json())
        .then(data => {
            const staffTableBody = document.getElementById('staff-table-body');
            if (staffTableBody) {
                staffTableBody.innerHTML = '';
                data.forEach(staff => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${staff.name}</td>
                        <td>${staff.position}</td>
                        <td>
                            <button onclick="editStaff(${staff.id})">修改</button>
                            <button onclick="deleteStaff(${staff.id})">刪除</button>
                        </td>
                    `;
                    staffTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading staff data:', error));
}

function loadArticlesData() {
    fetch('/api/articles')
        .then(response => response.json())
        .then(data => {
            const articlesTableBody = document.getElementById('articles-table-body');
            if (articlesTableBody) {
                articlesTableBody.innerHTML = '';
                data.forEach(article => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${article.title}</td>
                        <td>${article.author}</td>
                        <td>
                            <button onclick="editArticle(${article.id})">修改</button>
                            <button onclick="deleteArticle(${article.id})">刪除</button>
                        </td>
                    `;
                    articlesTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading articles data:', error));
}

function loadEventsData() {
    fetch('/api/events')
        .then(response => response.json())
        .then(data => {
            const eventsTableBody = document.getElementById('events-table-body');
            if (eventsTableBody) {
                eventsTableBody.innerHTML = '';
                data.forEach(event => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${event.name}</td>
                        <td>${event.date}</td>
                        <td>
                            <button onclick="editEvent(${event.id})">修改</button>
                            <button onclick="deleteEvent(${event.id})">刪除</button>
                        </td>
                    `;
                    eventsTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading events data:', error));
}

function loadRegulationsData() {
    fetch('/api/regulations')
        .then(response => response.json())
        .then(data => {
            const regulationsTableBody = document.getElementById('regulations-table-body');
            if (regulationsTableBody) {
                regulationsTableBody.innerHTML = '';
                data.forEach(regulation => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${regulation.title}</td>
                        <td>${regulation.date}</td>
                        <td>
                            <button onclick="editRegulation(${regulation.id})">修改</button>
                            <button onclick="deleteRegulation(${regulation.id})">刪除</button>
                        </td>
                    `;
                    regulationsTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading regulations data:', error));
}

function loadQAData() {
    fetch('/api/qa')
        .then(response => response.json())
        .then(data => {
            const qaTableBody = document.getElementById('qa-table-body');
            if (qaTableBody) {
                qaTableBody.innerHTML = '';
                data.forEach(qa => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${qa.question}</td>
                        <td>
                            <button onclick="editQA(${qa.id})">修改</button>
                            <button onclick="deleteQA(${qa.id})">刪除</button>
                        </td>
                    `;
                    qaTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading QA data:', error));
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = {};

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Redirect to appropriate page after form submission
            const redirectUrl = form.getAttribute('data-redirect');
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        })
        .catch(error => console.error('Error submitting form:', error));
}

function editStaff(id) {
    window.location.href = `staff_edit.html?id=${id}`;
}

function deleteStaff(id) {
    fetch(`/api/staff/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Staff deleted:', data);
            loadStaffData();
        })
        .catch(error => console.error('Error deleting staff:', error));
}

function editArticle(id) {
    window.location.href = `article_edit.html?id=${id}`;
}

function deleteArticle(id) {
    fetch(`/api/articles/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Article deleted:', data);
            loadArticlesData();
        })
        .catch(error => console.error('Error deleting article:', error));
}

function editEvent(id) {
    window.location.href = `event_edit.html?id=${id}`;
}

function deleteEvent(id) {
    fetch(`/api/events/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Event deleted:', data);
            loadEventsData();
        })
        .catch(error => console.error('Error deleting event:', error));
}

function editRegulation(id) {
    window.location.href = `regulation_edit.html?id=${id}`;
}

function deleteRegulation(id) {
    fetch(`/api/regulations/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Regulation deleted:', data);
            loadRegulationsData();
        })
        .catch(error => console.error('Error deleting regulation:', error));
}

function editQA(id) {
    window.location.href = `qa_edit.html?id=${id}`;
}

function deleteQA(id) {
    fetch(`/api/qa/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('QA deleted:', data);
            loadQAData();
        })
        .catch(error => console.error('Error deleting QA:', error));
}
