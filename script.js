document.addEventListener('DOMContentLoaded', () => {
    const addJobForm = document.getElementById('add-job-form');
    const jobListContainer = document.getElementById('job-list-container');
    const noJobsMessage = document.getElementById('no-jobs-message');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');


    let jobApplications = [];


    const generateId = () => `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const saveApplications = () => {
        localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
    };

    const loadApplications = () => {
        const storedApps = localStorage.getItem('jobApplications');
        jobApplications = storedApps ? JSON.parse(storedApps) : [];
    };


    const isFollowUpDue = (followUpDateStr) => {
        if (!followUpDateStr) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const followUpDate = new Date(followUpDateStr);
        followUpDate.setHours(0, 0, 0, 0);

        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);


        return followUpDate <= threeDaysFromNow;
    };


    const renderApplications = () => {
        jobListContainer.innerHTML = '';

        if (jobApplications.length === 0) {
            jobListContainer.appendChild(noJobsMessage);
            noJobsMessage.style.display = 'block';
            return;
        }

        noJobsMessage.style.display = 'none';

        jobApplications.forEach(app => {
            const jobItem = document.createElement('div');
            jobItem.classList.add('job-item');
            jobItem.dataset.id = app.id;

            if (isFollowUpDue(app.followUpDate)) {
                jobItem.classList.add('follow-up-due');
            }

            const followUpIndicator = isFollowUpDue(app.followUpDate)
                ? '<span class="follow-up-indicator" title="Follow-up due!"></span>'
                : '';

            jobItem.innerHTML = `
                <div class="job-item-details">
                    <p><strong>Company:</strong> ${app.company}</p>
                    <p><strong>Position:</strong> ${app.position}</p>
                    <p><strong>Date Applied:</strong> ${app.dateApplied || 'N/A'}</p>
                    <p><strong>Status:</strong> ${app.status} ${followUpIndicator}</p>
                    ${app.notes ? `<p><strong>Notes:</strong> ${app.notes}</p>` : ''}
                    ${app.followUpDate ? `<p><strong>Follow-up:</strong> ${app.followUpDate}</p>` : ''}
                </div>
                <div class="job-item-actions">
                    <select class="status-select">
                        <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="Screening" ${app.status === 'Screening' ? 'selected' : ''}>Screening</option>
                        <option value="Interview Scheduled" ${app.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
                        <option value="Offer Received" ${app.status === 'Offer Received' ? 'selected' : ''}>Offer Received</option>
                        <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        <option value="Withdrawn" ${app.status === 'Withdrawn' ? 'selected' : ''}>Withdrawn</option>
                    </select>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            `;


            const statusSelect = jobItem.querySelector('.status-select');
            statusSelect.addEventListener('change', (e) => {
                updateStatus(app.id, e.target.value);
            });

            const deleteBtn = jobItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteApplication(app.id);
            });

            jobListContainer.appendChild(jobItem);
        });
    };


    const addApplication = (e) => {
        e.preventDefault();

        const companyInput = document.getElementById('company-name');
        const positionInput = document.getElementById('position-title');
        const dateAppliedInput = document.getElementById('date-applied');
        const statusInput = document.getElementById('status');
        const notesInput = document.getElementById('notes');
        const followUpDateInput = document.getElementById('follow-up-date');


        if (!companyInput.value.trim() || !positionInput.value.trim()) {
            alert('Please fill in Company Name and Position Title.');
            return;
        }

        const newApp = {
            id: generateId(),
            company: companyInput.value.trim(),
            position: positionInput.value.trim(),
            dateApplied: dateAppliedInput.value,
            status: statusInput.value,
            notes: notesInput.value.trim(),
            followUpDate: followUpDateInput.value
        };

        jobApplications.push(newApp);
        saveApplications();
        renderApplications();


        addJobForm.reset();


        switchView('job-list-section');
    };

    const updateStatus = (id, newStatus) => {
        const appIndex = jobApplications.findIndex(app => app.id === id);
        if (appIndex > -1) {
            jobApplications[appIndex].status = newStatus;
            saveApplications();
            renderApplications();
        }
    };

    const deleteApplication = (id) => {
        if (confirm('Are you sure you want to delete this application?')) {
            jobApplications = jobApplications.filter(app => app.id !== id);
            saveApplications();
            renderApplications();
        }
    };


    const exportToCSV = () => {
        if (jobApplications.length === 0) {
            alert('No applications to export.');
            return;
        }

        const headers = ['Company', 'Position', 'Date Applied', 'Status', 'Notes', 'Follow-up Date'];
        const csvRows = [headers.join(',')];

        jobApplications.forEach(app => {
            const values = [
                app.company,
                app.position,
                app.dateApplied || '',
                app.status,

                `"${(app.notes || '').replace(/"/g, '""')}"`,
                app.followUpDate || ''
            ];
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });


        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'job_applications.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert('CSV export is not supported in your browser.');
        }
    };



    const switchView = (targetId) => {

        viewSections.forEach(section => {
            section.classList.add('hidden');
        });


        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }


        navButtons.forEach(button => {
            if (button.dataset.target === targetId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };


    addJobForm.addEventListener('submit', addApplication);
    exportCsvBtn.addEventListener('click', exportToCSV);


    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchView(button.dataset.target);
        });
    });

    loadApplications();
    renderApplications();


    switchView('job-list-section');
});
