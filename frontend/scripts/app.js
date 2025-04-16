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
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
        <div class="container mt-4">
            <h1>Student Dashboard</h1>
            <p>Welcome to your student dashboard. Here you can view and complete surveys.</p>
            
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Available Surveys</h5>
                            <p class="card-text">You have 3 surveys waiting for your response.</p>
                            <a href="#" class="btn btn-primary">View Surveys</a>
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
    `;
    
    // Add event listeners
    document.getElementById('btnLogout').addEventListener('click', () => {
        router.navigate('/');
    });
}

function renderFacultyDashboard(container) {
    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
                            <p class="card-text">You have 2 active surveys.</p>
                            <a href="#" class="btn btn-secondary">View Surveys</a>
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
        <div class="modal fade" id="addFieldModal" tabindex="-1" aria-labelledby="addFieldModalLabel" aria-hidden="true">
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
    `;
    
    // Add event listeners
    document.getElementById('btnLogout').addEventListener('click', () => {
        router.navigate('/');
    });
    
    // Create Survey Modal
    const createSurveyModal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
    const addFieldModal = new bootstrap.Modal(document.getElementById('addFieldModal'));
    
    // Open Create Survey Modal
    document.getElementById('btnCreateSurvey').addEventListener('click', () => {
        createSurveyModal.show();
    });
    
    document.getElementById('btnCreateSurveyCard').addEventListener('click', () => {
        createSurveyModal.show();
    });
    
    // Add Field Button
    document.getElementById('btnAddField').addEventListener('click', () => {
        addFieldModal.show();
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
            Swal.fire({
                title: "Error",
                text: "Field label is required",
                icon: "error"
            });
            return;
        }
        
        // Create field element
        const fieldId = 'field_' + Date.now();
        const fieldElement = document.createElement('div');
        fieldElement.className = 'card mb-3';
        fieldElement.id = fieldId;
        
        let fieldContent = '';
        
        // Generate field content based on type
        switch (fieldType) {
            case 'text':
                fieldContent = `<input type="text" class="form-control" placeholder="${fieldLabel}" ${fieldRequired ? 'required' : ''}>`;
                break;
            case 'textarea':
                fieldContent = `<textarea class="form-control" placeholder="${fieldLabel}" ${fieldRequired ? 'required' : ''}></textarea>`;
                break;
            case 'select':
                fieldContent = `<select class="form-select" ${fieldRequired ? 'required' : ''}>
                    <option value="" disabled selected>${fieldLabel}</option>`;
                if (fieldOptions) {
                    fieldOptions.split('\n').forEach(option => {
                        if (option.trim()) {
                            fieldContent += `<option value="${option.trim()}">${option.trim()}</option>`;
                        }
                    });
                }
                fieldContent += `</select>`;
                break;
            case 'multiselect':
                fieldContent = `<select class="form-select" multiple ${fieldRequired ? 'required' : ''}>
                    <option value="" disabled>${fieldLabel}</option>`;
                if (fieldOptions) {
                    fieldOptions.split('\n').forEach(option => {
                        if (option.trim()) {
                            fieldContent += `<option value="${option.trim()}">${option.trim()}</option>`;
                        }
                    });
                }
                fieldContent += `</select>`;
                break;
            case 'radio':
                fieldContent = `<div class="mb-2">${fieldLabel} ${fieldRequired ? '<span class="text-danger">*</span>' : ''}</div>`;
                if (fieldOptions) {
                    fieldOptions.split('\n').forEach(option => {
                        if (option.trim()) {
                            fieldContent += `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="${fieldId}" value="${option.trim()}" ${fieldRequired ? 'required' : ''}>
                                    <label class="form-check-label">${option.trim()}</label>
                                </div>`;
                        }
                    });
                }
                break;
            case 'checkbox':
                fieldContent = `<div class="mb-2">${fieldLabel} ${fieldRequired ? '<span class="text-danger">*</span>' : ''}</div>`;
                if (fieldOptions) {
                    fieldOptions.split('\n').forEach(option => {
                        if (option.trim()) {
                            fieldContent += `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="${fieldId}" value="${option.trim()}" ${fieldRequired ? 'required' : ''}>
                                    <label class="form-check-label">${option.trim()}</label>
                                </div>`;
                        }
                    });
                }
                break;
            case 'date':
                fieldContent = `<input type="date" class="form-control" ${fieldRequired ? 'required' : ''}>`;
                break;
            case 'number':
                fieldContent = `<input type="number" class="form-control" placeholder="${fieldLabel}" ${fieldRequired ? 'required' : ''}>`;
                break;
        }
        
        fieldElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title">${fieldLabel} ${fieldRequired ? '<span class="text-danger">*</span>' : ''}</h6>
                    <button type="button" class="btn btn-danger btn-sm delete-field" data-field-id="${fieldId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="card-text">
                    ${fieldContent}
                </div>
            </div>
        `;
        
        // Add field to survey
        document.getElementById('surveyFields').appendChild(fieldElement);
        
        // Add delete event listener
        document.querySelector(`[data-field-id="${fieldId}"]`).addEventListener('click', () => {
            document.getElementById(fieldId).remove();
        });
        
        // Reset form and close modal
        document.getElementById('fieldForm').reset();
        document.getElementById('optionsContainer').style.display = 'none';
        addFieldModal.hide();
    });
    
    // Save Survey
    document.getElementById('btnSaveSurvey').addEventListener('click', () => {
        const surveyTitle = document.getElementById('surveyTitle').value;
        const surveyDescription = document.getElementById('surveyDescription').value;
        
        if (!surveyTitle) {
            Swal.fire({
                title: "Error",
                text: "Survey title is required",
                icon: "error"
            });
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
        
        // In a real application, you would save this to a database
        console.log({
            title: surveyTitle,
            description: surveyDescription,
            fields: fields
        });
        
        // Show success message
        Swal.fire({
            title: "Success!",
            text: "Survey created successfully!",
            icon: "success"
        }).then(() => {
            // Reset form and close modal
            document.getElementById('surveyForm').reset();
            document.getElementById('surveyFields').innerHTML = '';
            createSurveyModal.hide();
        });
    });
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