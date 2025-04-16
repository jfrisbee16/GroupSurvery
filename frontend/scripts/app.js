// Router class to handle navigation
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
        
        if (this.currentRoute !== route) {
            this.currentRoute = route;
            this.renderComponent(route.component);
        }
    }
    
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
    
    renderComponent(component) {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        
        if (component) {
            component(appContainer);
        }
    }
}

// Component functions
function renderLogin(container) {
    container.innerHTML = `
        <div class="bg-image d-flex align-items-center justify-content-center"
        style="background-image: url('Event_COE_Doner recognition and awards_04Nov2024_69481-Enhanced-NR.jpg'); background-size: cover; height:100vh;">
            <form class="card col-12 col-md-6 col-lg-4 rounded" id="frmLogin">
                <div class="card-body">
                    <h2 class="text-center">TTU Group Survey Login</h2>
                    <h5 class="text-center">Login below</h5>

                    <!-- Email -->
                    <div class="mb-3">
                        <label for="strUsername" class="form-label d-flex align-items-start">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                            <input id="strUsername" class="form-control" type="email" placeholder="JohnDoe@tntech.edu" aria-label="input for user Email">
                        </div>
                    </div>
                    
                    <!-- Password -->
                    <div class="mb-3">
                        <label for="strPassword" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                            <input id="strPassword" class="form-control" type="password" placeholder="Password" aria-label="Password">
                        </div>
                        <div class="text-right">
                            <button type="button" class="btn btn-link" id="btnForgot">Forgot Password</button>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary col-12 mt-2" id="btnLogin">Login</button>
                    <button type="button" class="btn btn-link col-12 mt-0" id="btnSwap">Don't have an account? Register here</button>
                </div>
            </form>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('btnLogin').addEventListener('click', handleLogin);
    document.getElementById('btnSwap').addEventListener('click', () => router.navigate('/register'));
}

function renderRegister(container) {
    container.innerHTML = `
        <div class="bg-image d-flex align-items-center justify-content-center"
        style="background-image: url('Event_COE_Doner recognition and awards_04Nov2024_69481-Enhanced-NR.jpg'); background-size: cover; height:100vh;">
            <form class="card col-12 col-md-6 col-lg-4 p-4 shadow" id="frmRegister">
                <div class="card-body">
                    <h2 class="text-center mb-3">TTU Group Survey Registration</h2>
                    <h5 class="text-center mb-4">Register below</h5>
            
                    <!-- First Name -->
                    <div class="mb-3">
                        <label for="strFirstName" class="form-label">First Name</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                            <input id="strFirstName" class="form-control" type="text" placeholder="John" aria-label="First Name">
                        </div>
                    </div>
            
                    <!-- Middle Name -->
                    <div class="mb-3">
                        <label for="strMiddleName" class="form-label">Middle Name</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                            <input id="strMiddleName" class="form-control" type="text" placeholder="Optional" aria-label="Middle Name">
                        </div>
                    </div>
            
                    <!-- Last Name -->
                    <div class="mb-3">
                        <label for="strLastName" class="form-label">Last Name</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                            <input id="strLastName" class="form-control" type="text" placeholder="Doe" aria-label="Last Name">
                        </div>
                    </div>
            
                    <!-- Email -->
                    <div class="mb-3">
                        <label for="strEmail" class="form-label">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                            <input id="strEmail" class="form-control" type="email" placeholder="JohnDoe@tntech.edu" aria-label="Email">
                        </div>
                    </div>
                    
                    <!-- Role -->
                    <div class="mb-3">
                        <label for="strRole" class="form-label">Role</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                            <select id="strRole" class="form-select" aria-label="Input for role of user">
                                <option selected disabled value="">Select Role</option>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                            </select>
                        </div>
                    </div>
            
                    <!-- Password -->
                    <div class="mb-3">
                        <label for="strNewPassword" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                            <input id="strNewPassword" class="form-control" type="password" placeholder="Password" aria-label="Password">
                        </div>
                    </div>
            
                    <!-- Confirm Password -->
                    <div class="mb-3">
                        <label for="strConfirmPassword" class="form-label">Confirm Password</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                            <input id="strConfirmPassword" class="form-control" type="password" placeholder="Confirm Password" aria-label="Confirm Password">
                        </div>
                    </div>
            
                    <!-- Register Button -->
                    <button type="button" class="btn btn-primary col-12 mt-3" id="btnRegister">Register</button>
            
                    <!-- Back to Login Button -->
                    <button type="button" class="btn btn-link col-12 mt-2 text-center" id="btnBack">Already have an account? Login here</button>
                </div>
            </form>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('btnRegister').addEventListener('click', handleRegister);
    document.getElementById('btnBack').addEventListener('click', () => router.navigate('/'));
}

function renderStudentDashboard(container) {
    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">TTU Group Survey</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Surveys</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="btnLogout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4 " >
            <h1>Student Dashboard</h1>
            <p>Welcome to your student dashboard. Here you can view and complete surveys.</p>
            
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Available Surveys</h5>
                            <p class="card-text">You have 3 surveys waiting for your response.</p>
                            <button class="btn btn-primary" id="btnViewSurveys">View Surveys</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Completed Surveys</h5>
                            <p class="card-text">You have completed 5 surveys.</p>
                            <a href="#" class="btn btn-secondary">View History</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Groups</h5>
                            <p class="card-text">You are a member of 2 groups.</p>
                            <a href="#" class="btn btn-info">View Groups</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- View Surveys Modal -->
        <div class="modal fade" id="viewSurveysModal" tabindex="-1" aria-labelledby="viewSurveysModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="viewSurveysModalLabel">Available Surveys</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="surveysList" class="list-group">
                            <!-- Surveys will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Survey Detail Modal -->
        <div class="modal fade" id="surveyDetailModal" tabindex="-1" aria-labelledby="surveyDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="surveyDetailModalLabel">Survey Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="surveyDetailContent">
                            <!-- Survey details will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="btnEditSurvey">Edit</button>
                        <button type="button" class="btn btn-danger" id="btnDeleteSurvey">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Group Responses Modal -->
        <div class="modal fade" id="groupResponsesModal" tabindex="-1" aria-labelledby="groupResponsesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="groupResponsesModalLabel">Group Responses</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="groupResponsesContent">
                            <!-- Group responses will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Manage Groups Modal -->
        <div class="modal fade" id="manageGroupsModal" tabindex="-1" aria-labelledby="manageGroupsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manageGroupsModalLabel">Manage Groups</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-end mb-3">
                            <button type="button" class="btn btn-success" id="btnAddNewGroup">
                                <i class="bi bi-plus-circle"></i> Add New Group
                            </button>
                        </div>
                        <div id="groupsListContainer" class="list-group">
                            <!-- Groups will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add custom CSS for modal z-index -->
        <style>
            .modal-backdrop {
                z-index: 1050;
            }
            #createSurveyModal {
                z-index: 1055 !important;
            }
            #createSurveyModal .modal-dialog {
                z-index: 1056 !important;
            }
            #addFieldModal {
                z-index: 1060 !important;
            }
            #addFieldModal .modal-dialog {
                z-index: 1061 !important;
            }
            #addGroupModal {
                z-index: 1060 !important;
            }
            #addGroupModal .modal-dialog {
                z-index: 1061 !important;
            }
            #manageGroupsModal {
                z-index: 1060 !important;
            }
            #manageGroupsModal .modal-dialog {
                z-index: 1061 !important;
            }
            .blur-background {
                filter: blur(5px);
                -webkit-filter: blur(5px);
            }
        </style>
    `;
    
    // Add event listeners
    document.getElementById('btnLogout').addEventListener('click', () => {
        router.navigate('/');
    });
    
    // View Surveys Modal
    const viewSurveysModal = new bootstrap.Modal(document.getElementById('viewSurveysModal'));
    const surveyDetailModal = new bootstrap.Modal(document.getElementById('surveyDetailModal'));
    const groupResponsesModal = new bootstrap.Modal(document.getElementById('groupResponsesModal'));
    const manageGroupsModal = new bootstrap.Modal(document.getElementById('manageGroupsModal'));
    
    // Open View Surveys Modal
    document.getElementById('btnViewSurveys').addEventListener('click', () => {
        loadSurveys();
        viewSurveysModal.show();
    });
    
    // Function to load surveys from local storage
    function loadSurveys() {
        const surveysList = document.getElementById('surveysList');
        surveysList.innerHTML = '';
        
        // Get surveys from local storage
        const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
        
        if (surveys.length === 0) {
            surveysList.innerHTML = '<div class="alert alert-info">No surveys available.</div>';
            return;
        }
        
        // Create list items for each survey
        surveys.forEach((survey, index) => {
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.className = 'list-group-item list-group-item-action';
            listItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${survey.title}</h5>
                    <small>Created: ${new Date(survey.createdAt).toLocaleDateString()}</small>
                </div>
                <p class="mb-1">${survey.description || 'No description'}</p>
                <small>${survey.groups ? survey.groups.length : 0} groups assigned</small>
            `;
            
            // Add click event to view survey details
            listItem.addEventListener('click', () => {
                viewSurveysModal.hide();
                showSurveyDetails(survey, index);
            });
            
            surveysList.appendChild(listItem);
        });
    }
    
    // Function to show survey details
    function showSurveyDetails(survey, index) {
        const surveyDetailContent = document.getElementById('surveyDetailContent');
        const surveyDetailModalLabel = document.getElementById('surveyDetailModalLabel');
        
        surveyDetailModalLabel.textContent = survey.title;
        
        // Create HTML for survey details
        let html = `
            <div class="mb-4">
                <h6>Description</h6>
                <p>${survey.description || 'No description'}</p>
            </div>
            
            <div class="mb-4">
                <h6>Survey Fields</h6>
                <div class="list-group">
        `;
        
        // Add fields
        if (survey.fields && survey.fields.length > 0) {
            survey.fields.forEach(field => {
                html += `
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${field.label}</h6>
                            <small>${field.required ? 'Required' : 'Optional'}</small>
                        </div>
                        <p class="mb-1">Type: ${field.type}</p>
                    </div>
                `;
            });
        } else {
            html += '<div class="alert alert-info">No fields defined for this survey.</div>';
        }
        
        html += `
                </div>
            </div>
            
            <div class="mb-4">
                <h6>Assigned Groups</h6>
                <div class="list-group" id="assignedGroupsList">
        `;
        
        // Add assigned groups
        if (survey.groups && survey.groups.length > 0) {
            survey.groups.forEach(group => {
                html += `
                    <a href="#" class="list-group-item list-group-item-action group-item" data-group-id="${group.id}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${group.name}</h6>
                            <small>${group.completedCount || 0}/${group.totalMembers || 0} completed</small>
                        </div>
                    </a>
                `;
            });
        } else {
            html += '<div class="alert alert-info">No groups assigned to this survey.</div>';
        }
        
        html += `
                </div>
            </div>
        `;
        
        surveyDetailContent.innerHTML = html;
        
        // Add event listeners for group items
        document.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const groupId = item.getAttribute('data-group-id');
                showGroupResponses(survey, groupId);
            });
        });
        
        // Add event listeners for edit and delete buttons
        document.getElementById('btnEditSurvey').addEventListener('click', () => {
            editSurvey(survey, index);
        });
        
        document.getElementById('btnDeleteSurvey').addEventListener('click', () => {
            deleteSurvey(index);
        });
        
        surveyDetailModal.show();
    }
    
    // Function to show group responses
    function showGroupResponses(survey, groupId) {
        const groupResponsesContent = document.getElementById('groupResponsesContent');
        const groupResponsesModalLabel = document.getElementById('groupResponsesModalLabel');
        
        // Find the group
        const group = survey.groups.find(g => g.id === groupId);
        if (!group) return;
        
        groupResponsesModalLabel.textContent = `${group.name} - Responses`;
        
        // Create HTML for group responses
        let html = `
            <div class="mb-3">
                <h6>Group Information</h6>
                <p>Total Members: ${group.totalMembers || 0}</p>
                <p>Completed: ${group.completedCount || 0}</p>
                <p>Completion Rate: ${group.totalMembers ? Math.round((group.completedCount || 0) / group.totalMembers * 100) : 0}%</p>
            </div>
            
            <div class="mb-3">
                <h6>Member Responses</h6>
                <div class="list-group">
        `;
        
        // Add member responses
        if (group.members && group.members.length > 0) {
            group.members.forEach(member => {
                html += `
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${member.name}</h6>
                            <small>${member.completed ? 'Completed' : 'Pending'}</small>
                        </div>
                        ${member.completed ? `<p class="mb-1">Completed on: ${new Date(member.completedAt).toLocaleDateString()}</p>` : ''}
                    </div>
                `;
            });
        } else {
            html += '<div class="alert alert-info">No members in this group.</div>';
        }
        
        html += `
                </div>
            </div>
        `;
        
        groupResponsesContent.innerHTML = html;
        
        // Hide survey detail modal and show group responses modal
        surveyDetailModal.hide();
        groupResponsesModal.show();
    }
    
    // Function to edit a survey
    function editSurvey(survey, index) {
        // Hide the survey detail modal
        surveyDetailModal.hide();
        
        // Show the create survey modal with pre-filled data
        const createSurveyModal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
        
        // Set the form values
        document.getElementById('surveyTitle').value = survey.title;
        document.getElementById('surveyDescription').value = survey.description || '';
        
        // Clear existing fields
        const surveyFields = document.getElementById('surveyFields');
        surveyFields.innerHTML = '';
        
        // Add existing fields
        if (survey.fields && survey.fields.length > 0) {
            survey.fields.forEach(field => {
                const fieldElement = createFieldElement(field);
                surveyFields.appendChild(fieldElement);
            });
        }
        
        // Clear existing groups
        const groupsList = document.getElementById('groupsList');
        groupsList.innerHTML = '';
        
        // Add existing groups
        if (survey.groups && survey.groups.length > 0) {
            survey.groups.forEach(group => {
                const groupElement = createGroupElement(group);
                groupsList.appendChild(groupElement);
            });
        }
        
        // Update the save button to update instead of create
        const saveButton = document.getElementById('btnSaveSurvey');
        saveButton.textContent = 'Update Survey';
        
        // Store the index for updating
        saveButton.setAttribute('data-survey-index', index);
        
        // Show the modal
        createSurveyModal.show();
    }
    
    // Function to delete a survey
    function deleteSurvey(index) {
        // Confirm deletion
        if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
            // Get surveys from local storage
            const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
            
            // Remove the survey
            surveys.splice(index, 1);
            
            // Save back to local storage
            localStorage.setItem('surveys', JSON.stringify(surveys));
            
            // Hide the modal
            surveyDetailModal.hide();
            
            // Show success message
            alert('Survey deleted successfully.');
            
            // Reload surveys
            loadSurveys();
        }
    }
    
    // Helper function to create a field element
    function createFieldElement(field) {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'card mb-3';
        fieldElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title">${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}</h6>
                    <button type="button" class="btn btn-danger btn-sm delete-field">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="card-text">
                    <p>Type: ${field.type}</p>
                    ${field.options ? `<p>Options: ${field.options.join(', ')}</p>` : ''}
                </div>
            </div>
        `;
        
        // Add delete event listener
        fieldElement.querySelector('.delete-field').addEventListener('click', () => {
            fieldElement.remove();
        });
        
        return fieldElement;
    }
    
    // Helper function to create a group element
    function createGroupElement(group) {
        const groupElement = document.createElement('div');
        groupElement.className = 'card mb-3';
        groupElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title">${group.name}</h6>
                    <button type="button" class="btn btn-danger btn-sm delete-group">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="card-text">
                    <p>Members: ${group.members.length}</p>
                    <p>${group.members.map(m => m.name).join(', ')}</p>
                </div>
            </div>
        `;
        
        // Add delete event listener
        groupElement.querySelector('.delete-group').addEventListener('click', () => {
            groupElement.remove();
        });
        
        return groupElement;
    }
}

function renderFacultyDashboard(container) {
    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">TTU Group Survey</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnCreateSurvey">Create Survey</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Manage Groups</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="btnLogout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4">
            <h1>Faculty Dashboard</h1>
            <p>Welcome to your faculty dashboard. Here you can create and manage surveys.</p>
            
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Create Survey</h5>
                            <p class="card-text">Create a new survey for your students.</p>
                            <button class="btn btn-primary" id="btnCreateSurveyCard">Create Survey</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Active Surveys</h5>
                            <p class="card-text">You have <span id="activeSurveyCount">0</span> active surveys.</p>
                            <button class="btn btn-secondary" id="btnViewSurveys">View Surveys</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Manage Groups</h5>
                            <p class="card-text">Create and manage student groups.</p>
                            <a href="#" class="btn btn-info">Manage Groups</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Create Survey Modal -->
        <div class="modal fade" id="createSurveyModal" tabindex="-1" aria-labelledby="createSurveyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createSurveyModalLabel">Create New Survey</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="surveyForm">
                            <div class="mb-3">
                                <label for="surveyTitle" class="form-label">Survey Title</label>
                                <input type="text" class="form-control" id="surveyTitle" required>
                            </div>
                            <div class="mb-3">
                                <label for="surveyDescription" class="form-label">Survey Description</label>
                                <textarea class="form-control" id="surveyDescription" rows="3"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <h5>Survey Fields</h5>
                                <div id="surveyFields" class="mb-3">
                                    <!-- Fields will be added here dynamically -->
                                </div>
                                <button type="button" class="btn btn-success" id="btnAddField">
                                    <i class="bi bi-plus-circle"></i> Add Field
                                </button>
                            </div>
                            
                            <div class="mb-3">
                                <h5>Assign to Groups</h5>
                                <div id="groupsList" class="mb-3">
                                    <!-- Groups will be added here dynamically -->
                                </div>
                                <button type="button" class="btn btn-success" id="btnAddGroup">
                                    <i class="bi bi-plus-circle"></i> Add Group
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="btnSaveSurvey">Save Survey</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add Field Modal -->
        <div class="modal fade" id="addFieldModal" tabindex="-1" aria-labelledby="addFieldModalLabel" aria-hidden="true" style="z-index: 1060;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addFieldModalLabel">Add Survey Field</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="fieldForm">
                            <div class="mb-3">
                                <label for="fieldLabel" class="form-label">Field Label</label>
                                <input type="text" class="form-control" id="fieldLabel" required>
                            </div>
                            <div class="mb-3">
                                <label for="fieldType" class="form-label">Field Type</label>
                                <select class="form-select" id="fieldType" required>
                                    <option value="text">Text Box</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="select">Dropdown</option>
                                    <option value="multiselect">Multiple Select</option>
                                    <option value="radio">Radio Buttons</option>
                                    <option value="checkbox">Checkboxes</option>
                                    <option value="date">Date</option>
                                    <option value="number">Number</option>
                                </select>
                            </div>
                            <div class="mb-3" id="optionsContainer" style="display: none;">
                                <label for="fieldOptions" class="form-label">Options (one per line)</label>
                                <textarea class="form-control" id="fieldOptions" rows="3"></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="fieldRequired">
                                <label class="form-check-label" for="fieldRequired">
                                    Required field
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="btnSaveField">Add Field</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add Group Modal -->
        <div class="modal fade" id="addGroupModal" tabindex="-1" aria-labelledby="addGroupModalLabel" aria-hidden="true" style="z-index: 1060;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addGroupModalLabel">Add Group</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="groupForm">
                            <div class="mb-3">
                                <label for="groupName" class="form-label">Group Name</label>
                                <input type="text" class="form-control" id="groupName" required>
                            </div>
                            <div class="mb-3">
                                <label for="groupMembers" class="form-label">Group Members (one per line)</label>
                                <textarea class="form-control" id="groupMembers" rows="5" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="btnSaveGroup">Add Group</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- View Surveys Modal -->
        <div class="modal fade" id="viewSurveysModal" tabindex="-1" aria-labelledby="viewSurveysModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="viewSurveysModalLabel">Your Surveys</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="surveysList" class="list-group">
                            <!-- Surveys will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Survey Detail Modal -->
        <div class="modal fade" id="surveyDetailModal" tabindex="-1" aria-labelledby="surveyDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="surveyDetailModalLabel">Survey Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="surveyDetailContent">
                            <!-- Survey details will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="btnEditSurvey">Edit</button>
                        <button type="button" class="btn btn-danger" id="btnDeleteSurvey">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Group Responses Modal -->
        <div class="modal fade" id="groupResponsesModal" tabindex="-1" aria-labelledby="groupResponsesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="groupResponsesModalLabel">Group Responses</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="groupResponsesContent">
                            <!-- Group responses will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Manage Groups Modal -->
        <div class="modal fade" id="manageGroupsModal" tabindex="-1" aria-labelledby="manageGroupsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manageGroupsModalLabel">Manage Groups</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-end mb-3">
                            <button type="button" class="btn btn-success" id="btnAddNewGroup">
                                <i class="bi bi-plus-circle"></i> Add New Group
                            </button>
                        </div>
                        <div id="groupsListContainer" class="list-group">
                            <!-- Groups will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add custom CSS for modal z-index -->
        <style>
            .modal-backdrop {
                z-index: 1050;
            }
            #createSurveyModal {
                z-index: 1055 !important;
            }
            #createSurveyModal .modal-dialog {
                z-index: 1056 !important;
            }
            #addFieldModal {
                z-index: 1060 !important;
            }
            #addFieldModal .modal-dialog {
                z-index: 1061 !important;
            }
            #addGroupModal {
                z-index: 1060 !important;
            }
            #addGroupModal .modal-dialog {
                z-index: 1061 !important;
            }
            #manageGroupsModal {
                z-index: 1060 !important;
            }
            #manageGroupsModal .modal-dialog {
                z-index: 1061 !important;
            }
            .blur-background {
                filter: blur(5px);
                -webkit-filter: blur(5px);
            }
        </style>
    `;
    
    // Add event listeners
    document.getElementById('btnLogout').addEventListener('click', () => {
        router.navigate('/');
    });
    
    // Create Survey Modal
    const createSurveyModal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
    const addFieldModal = new bootstrap.Modal(document.getElementById('addFieldModal'));
    const addGroupModal = new bootstrap.Modal(document.getElementById('addGroupModal'));
    const viewSurveysModal = new bootstrap.Modal(document.getElementById('viewSurveysModal'));
    const surveyDetailModal = new bootstrap.Modal(document.getElementById('surveyDetailModal'));
    const groupResponsesModal = new bootstrap.Modal(document.getElementById('groupResponsesModal'));
    const manageGroupsModal = new bootstrap.Modal(document.getElementById('manageGroupsModal'));
    
    // Update active survey count
    updateActiveSurveyCount();
    
    // Open Create Survey Modal
    document.getElementById('btnCreateSurvey').addEventListener('click', () => {
        resetSurveyForm();
        createSurveyModal.show();
    });
    
    document.getElementById('btnCreateSurveyCard').addEventListener('click', () => {
        resetSurveyForm();
        createSurveyModal.show();
    });
    
    // View Surveys Button
    document.getElementById('btnViewSurveys').addEventListener('click', () => {
        loadSurveys();
        viewSurveysModal.show();
    });
    
    // Manage Groups Buttons
    document.querySelector('a[href="#"][class="nav-link"]').addEventListener('click', (e) => {
        if (e.target.textContent === 'Manage Groups') {
            loadGroups();
            manageGroupsModal.show();
        }
    });
    
    document.querySelector('a[href="#"][class="btn btn-info"]').addEventListener('click', () => {
        loadGroups();
        manageGroupsModal.show();
    });
    
    // Add New Group Button in Manage Groups Modal
    document.getElementById('btnAddNewGroup').addEventListener('click', () => {
        // Add blur class to Manage Groups modal content
        const manageGroupsContent = document.querySelector('#manageGroupsModal .modal-content');
        manageGroupsContent.classList.add('blur-background');
        addGroupModal.show();
    });
    
    // When Add Group modal is closed, remove blur from Manage Groups modal
    document.getElementById('addGroupModal').addEventListener('hidden.bs.modal', () => {
        const manageGroupsContent = document.querySelector('#manageGroupsModal .modal-content');
        manageGroupsContent.classList.remove('blur-background');
        // Reload groups after adding a new one
        loadGroups();
    });
    
    // Add Field Button
    document.getElementById('btnAddField').addEventListener('click', () => {
        // Add blur class to Create Survey modal content
        const createSurveyContent = document.querySelector('#createSurveyModal .modal-content');
        createSurveyContent.classList.add('blur-background');
        addFieldModal.show();
    });
    
    // When Add Field modal is closed, remove blur from Create Survey modal
    document.getElementById('addFieldModal').addEventListener('hidden.bs.modal', () => {
        const createSurveyContent = document.querySelector('#createSurveyModal .modal-content');
        createSurveyContent.classList.remove('blur-background');
    });
    
    // Add Group Button in Create Survey Modal
    document.getElementById('btnAddGroup').addEventListener('click', () => {
        // Add blur class to Create Survey modal content
        const createSurveyContent = document.querySelector('#createSurveyModal .modal-content');
        createSurveyContent.classList.add('blur-background');
        addGroupModal.show();
    });
    
    // When Add Group modal is closed, remove blur from Create Survey modal
    document.getElementById('addGroupModal').addEventListener('hidden.bs.modal', () => {
        const createSurveyContent = document.querySelector('#createSurveyModal .modal-content');
        createSurveyContent.classList.remove('blur-background');
    });
    
    // Field Type Change
    document.getElementById('fieldType').addEventListener('change', (e) => {
        const optionsContainer = document.getElementById('optionsContainer');
        if (['select', 'multiselect', 'radio', 'checkbox'].includes(e.target.value)) {
            optionsContainer.style.display = 'block';
        } else {
            optionsContainer.style.display = 'none';
        }
    });
    
    // Save Field
    document.getElementById('btnSaveField').addEventListener('click', () => {
        const fieldLabel = document.getElementById('fieldLabel').value;
        const fieldType = document.getElementById('fieldType').value;
        const fieldRequired = document.getElementById('fieldRequired').checked;
        const fieldOptions = document.getElementById('fieldOptions').value;
        
        if (!fieldLabel) {
            alert('Field label is required');
            return;
        }
        
        // Create field element
        const fieldElement = document.createElement('div');
        fieldElement.className = 'card mb-3';
        fieldElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title">${fieldLabel} ${fieldRequired ? '<span class="text-danger">*</span>' : ''}</h6>
                    <button type="button" class="btn btn-danger btn-sm delete-field">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="card-text">
                    <p>Type: ${fieldType}</p>
                    ${fieldOptions ? `<p>Options: ${fieldOptions.split('\n').join(', ')}</p>` : ''}
                </div>
            </div>
        `;
        
        // Add delete event listener
        fieldElement.querySelector('.delete-field').addEventListener('click', () => {
            fieldElement.remove();
        });
        
        // Add field to survey
        document.getElementById('surveyFields').appendChild(fieldElement);
        
        // Reset form and close modal
        document.getElementById('fieldForm').reset();
        document.getElementById('optionsContainer').style.display = 'none';
        addFieldModal.hide();
    });
    
    // Save Group
    document.getElementById('btnSaveGroup').addEventListener('click', () => {
        const groupName = document.getElementById('groupName').value;
        const groupMembersText = document.getElementById('groupMembers').value;
        
        if (!groupName || !groupMembersText) {
            alert('Group name and members are required');
            return;
        }
        
        // Parse members
        const members = groupMembersText.split('\n')
            .map(member => member.trim())
            .filter(member => member.length > 0);
        
        if (members.length === 0) {
            alert('At least one group member is required');
            return;
        }
        
        // Create group object
        const group = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: groupName,
            members: members.map(name => ({
                name,
                completed: false
            })),
            totalMembers: members.length,
            completedCount: 0
        };
        
        // Save to local storage
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups.push(group);
        localStorage.setItem('groups', JSON.stringify(groups));
        
        // If we're in the Create Survey modal, add the group to the survey
        if (document.getElementById('groupsList')) {
            // Create group element
            const groupElement = document.createElement('div');
            groupElement.className = 'card mb-3';
            groupElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="card-title">${groupName}</h6>
                        <button type="button" class="btn btn-danger btn-sm delete-group">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-text">
                        <p>Members: ${members.length}</p>
                        <p>${members.join(', ')}</p>
                    </div>
                </div>
            `;
            
            // Add delete event listener
            groupElement.querySelector('.delete-group').addEventListener('click', () => {
                groupElement.remove();
            });
            
            // Add group to survey
            document.getElementById('groupsList').appendChild(groupElement);
        }
        
        // Reset form and close modal
        document.getElementById('groupForm').reset();
        addGroupModal.hide();
    });
    
    // Function to load groups from local storage
    function loadGroups() {
        const groupsListContainer = document.getElementById('groupsListContainer');
        groupsListContainer.innerHTML = '';
        
        // Get groups from local storage
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        
        if (groups.length === 0) {
            groupsListContainer.innerHTML = '<div class="alert alert-info">No groups available. Click "Add New Group" to create one.</div>';
            return;
        }
        
        // Create list items for each group
        groups.forEach((group, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">${group.name}</h5>
                        <p class="mb-1">${group.members.length} members</p>
                    </div>
                    <div>
                        <button type="button" class="btn btn-sm btn-primary me-2 edit-group" data-group-id="${group.id}">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button type="button" class="btn btn-sm btn-danger delete-group" data-group-id="${group.id}">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="mt-2">
                    <small>Members: ${group.members.map(m => m.name).join(', ')}</small>
                </div>
            `;
            
            // Add event listeners for edit and delete buttons
            listItem.querySelector('.edit-group').addEventListener('click', () => {
                editGroup(group, index);
            });
            
            listItem.querySelector('.delete-group').addEventListener('click', () => {
                deleteGroup(index);
            });
            
            groupsListContainer.appendChild(listItem);
        });
    }
    
    // Function to edit a group
    function editGroup(group, index) {
        // TODO: Implement group editing functionality
        alert('Group editing functionality will be implemented soon.');
    }
    
    // Function to delete a group
    function deleteGroup(index) {
        // Confirm deletion
        if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            // Get groups from local storage
            const groups = JSON.parse(localStorage.getItem('groups')) || [];
            
            // Remove the group
            groups.splice(index, 1);
            
            // Save back to local storage
            localStorage.setItem('groups', JSON.stringify(groups));
            
            // Reload groups
            loadGroups();
        }
    }
    
    // Save Survey
    document.getElementById('btnSaveSurvey').addEventListener('click', () => {
        const surveyTitle = document.getElementById('surveyTitle').value;
        const surveyDescription = document.getElementById('surveyDescription').value;
        
        if (!surveyTitle) {
            alert('Survey title is required');
            return;
        }
        
        // Get all fields
        const fields = [];
        document.querySelectorAll('#surveyFields .card').forEach(card => {
            const fieldLabel = card.querySelector('.card-title').textContent.replace('*', '').trim();
            const fieldRequired = card.querySelector('.card-title').textContent.includes('*');
            const fieldType = card.querySelector('input, select, textarea').type || 
                             (card.querySelector('select') ? 'select' : 
                              card.querySelector('textarea') ? 'textarea' : 'text');
            
            fields.push({
                label: fieldLabel,
                required: fieldRequired,
                type: fieldType
            });
        });
        
        // Get all groups
        const groups = [];
        document.querySelectorAll('#groupsList .card').forEach(card => {
            const groupName = card.querySelector('.card-title').textContent;
            const membersText = card.querySelector('p:nth-child(2)').textContent;
            const members = membersText.split(', ');
            
            groups.push({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: groupName,
                members: members.map(name => ({
                    name,
                    completed: false
                })),
                totalMembers: members.length,
                completedCount: 0
            });
        });
        
        // Create survey object
        const survey = {
            title: surveyTitle,
            description: surveyDescription,
            fields: fields,
            groups: groups,
            createdAt: new Date().toISOString()
        };
        
        // Check if we're updating an existing survey
        const saveButton = document.getElementById('btnSaveSurvey');
        const surveyIndex = saveButton.getAttribute('data-survey-index');
        
        if (surveyIndex !== null) {
            // Update existing survey
            const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
            surveys[surveyIndex] = survey;
            localStorage.setItem('surveys', JSON.stringify(surveys));
            
            // Reset button
            saveButton.textContent = 'Save Survey';
            saveButton.removeAttribute('data-survey-index');
        } else {
            // Add new survey
            const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
            surveys.push(survey);
            localStorage.setItem('surveys', JSON.stringify(surveys));
        }
        
        // Update active survey count
        updateActiveSurveyCount();
        
        // Close modal
        createSurveyModal.hide();
        
        // Show success message
        alert('Survey saved successfully');
    });
    
    // Function to reset the survey form
    function resetSurveyForm() {
        document.getElementById('surveyTitle').value = '';
        document.getElementById('surveyDescription').value = '';
        document.getElementById('surveyFields').innerHTML = '';
        document.getElementById('groupsList').innerHTML = '';
        
        // Reset save button
        const saveButton = document.getElementById('btnSaveSurvey');
        saveButton.textContent = 'Save Survey';
        saveButton.removeAttribute('data-survey-index');
    }
    
    // Function to update active survey count
    function updateActiveSurveyCount() {
        const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
        document.getElementById('activeSurveyCount').textContent = surveys.length;
    }
}

// Event handlers
function handleLogin(e) {
    e.preventDefault();
    
    const strEmail = document.querySelector("#strUsername").value.trim();
    const strPassword = document.querySelector("#strPassword").value.trim();
    
    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let errors = "";

    if (!regEmail.test(strEmail)) {
        errors += "<p>Please enter a valid email address.</p>";
    } 
    if (!regPassword.test(strPassword)) {
        errors += "<p>Please enter a valid password.</p>";
    }

    if (errors) {
        Swal.fire({
            title: "Error",
            html: errors,
            icon: "error",
        });
    } else {
        // For demo purposes, redirect based on email
        if (strEmail.includes('student')) {
            Swal.fire({
                title: "Success!",
                text: "Login successful! Redirecting to student dashboard...",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                router.navigate('/student');
            });
        } else if (strEmail.includes('faculty')) {
            Swal.fire({
                title: "Success!",
                text: "Login successful! Redirecting to faculty dashboard...",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                router.navigate('/faculty');
            });
        } else {
            Swal.fire({
                title: "Success!",
                text: "Login Successful!",
                icon: "success"
            });
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const regPhone = /^[0-9]{10}$/;
    const regZip = /^[0-9]{5}$/;
    const role = document.getElementById("strRole").value;

    let email = document.querySelector("#strEmail").value.trim();
    let password = document.querySelector("#strNewPassword").value.trim();
    let confirmPassword = document.querySelector("#strConfirmPassword").value.trim();
    let firstName = document.querySelector("#strFirstName").value.trim();
    let lastName = document.querySelector("#strLastName").value.trim();
    
    let errors = "";

    // Required Field Validation
    if (!firstName) errors += "<p class='mb-1 mt-1'>First Name is required</p>";
    if (!lastName) errors += "<p class='mb-1 mt-1'>Last Name is required</p>";    

    // Email Validation
    if (!regEmail.test(email)) {
        errors += "<p class='mb-1 mt-1'>Invalid email format</p>";
    }

    // Password Validation
    if (!regPass.test(password)) {
        errors += "<p class='mb-1 mt-1'>Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one number</p>";
    }

    if (password !== confirmPassword) {
        errors += "<p class='mb-1 mt-1'>Passwords do not match</p>";
    }

    if (errors) {
        Swal.fire({
            title: "Registration Error!",
            html: errors,
            icon: "error"
        });
    } else if(role === 'Student'){
        Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Sending student to the student dashboard"
        }).then(()=>{
            router.navigate('/student');
        });
    } else if(role === 'Faculty'){
        Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Sending faculty to the faculty dashboard"
        }).then(()=>{
            router.navigate('/faculty');
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Registration Error",
            text: "Please select a valid role"
        });
    }
}

// Define routes
const routes = [
    { path: '/', component: renderLogin },
    { path: '/register', component: renderRegister },
    { path: '/student', component: renderStudentDashboard },
    { path: '/faculty', component: renderFacultyDashboard }
];

// Initialize router
const router = new Router(routes); 