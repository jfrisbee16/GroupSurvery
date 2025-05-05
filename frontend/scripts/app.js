import { authAPI, surveyAPI, groupAPI } from '../js/api.js';

// Router class for handling navigation
class Router {
    constructor() {
        console.log('Initializing Router...');
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        try {
            console.log('Router init started');
            // Check if user is already logged in
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Current user:', user);
            
            if (token && user) {
                if (user.role === 'Student') {
                    console.log('Redirecting to student dashboard');
                    this.navigate('/student.html', false);
                } else if (user.role === 'Faculty') {
                    console.log('Redirecting to faculty dashboard');
                    this.navigate('/faculty.html', false);
                }
            } else {
                console.log('No user found, redirecting to login');
                this.navigate('/', false);
            }

            // Handle browser back/forward
            window.addEventListener('popstate', () => {
                console.log('Popstate event triggered');
                this.handleRouteChange();
            });
        } catch (error) {
            console.error('Error in Router.init:', error);
            this.navigate('/', false);
        }
    }

    addRoute(path, handler) {
        console.log(`Adding route: ${path}`);
        this.routes[path] = handler;
    }

    handleRouteChange() {
        try {
            console.log('Handling route change');
            const path = window.location.pathname;
            console.log('Current path:', path);
            this.currentRoute = path;
            const handler = this.routes[path];
            
            if (handler) {
                console.log(`Found handler for path: ${path}`);
                handler();
            } else {
                console.log(`No handler found for path: ${path}, redirecting to root`);
                window.history.pushState({}, '', '/');
                this.currentRoute = '/';
                if (this.routes['/']) {
                    this.routes['/']();
                }
            }
        } catch (error) {
            console.error('Error in handleRouteChange:', error);
            this.navigate('/', false);
        }
    }

    navigate(path, updateHistory = true) {
        try {
            console.log(`Navigating to: ${path}`);
            if (updateHistory) {
                window.history.pushState({}, '', path);
            }
            this.currentRoute = path;
            const handler = this.routes[path];
            
            if (handler) {
                console.log(`Found handler for path: ${path}`);
                handler();
            } else {
                console.log(`No handler found for path: ${path}, redirecting to root`);
                window.history.pushState({}, '', '/');
                this.currentRoute = '/';
                if (this.routes['/']) {
                    this.routes['/']();
                }
            }
        } catch (error) {
            console.error('Error in navigate:', error);
            this.navigate('/', false);
        }
    }
}

// Initialize router
console.log('Creating router instance...');
const router = new Router();

// Define routes
console.log('Defining routes...');
const routes = {
    '/': () => {
        try {
            console.log('Rendering root route');
            const app = document.getElementById('app');
            if (!app) {
                console.error('App container not found');
                return;
            }

            if (isAuthenticated()) {
                console.log('User is authenticated');
                const user = JSON.parse(localStorage.getItem('user'));
                if (user.role === 'Student') {
                    console.log('User is student, redirecting to student dashboard');
                    router.navigate('/student.html', true);
                } else {
                    console.log('User is faculty, redirecting to faculty dashboard');
                    router.navigate('/faculty.html', true);
                }
                return;
            }

            console.log('Rendering login form');
            renderLogin(app);
        } catch (error) {
            console.error('Error in root route handler:', error);
        }
    },
    '/student-dashboard': renderStudentDashboard,
    '/faculty-dashboard': renderFacultyDashboard,
    '/profile': renderProfile,
    '/settings': renderSettings
};

// Add routes to router
console.log('Adding routes to router...');
Object.entries(routes).forEach(([path, handler]) => {
    router.addRoute(path, handler);
});

// Helper functions with error handling
function getToken() {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

function setToken(token) {
    try {
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

function removeToken() {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error removing token:', error);
    }
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

function setUser(user) {
    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error setting user:', error);
    }
}

function removeUser() {
    try {
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error removing user:', error);
    }
}

function isAuthenticated() {
    try {
        return !!getToken() && !!getUser();
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

function isFaculty() {
    try {
        const user = getUser();
        return user && user.role === 'Faculty';
    } catch (error) {
        console.error('Error checking faculty role:', error);
        return false;
    }
}

function isStudent() {
    try {
        const user = getUser();
        return user && user.role === 'Student';
    } catch (error) {
        console.error('Error checking student role:', error);
        return false;
    }
}

function logout() {
    try {
        removeToken();
        removeUser();
        router.navigate('/', true);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    try {
        const email = document.querySelector('#strUsername').value.trim();
        const password = document.querySelector('#strPassword').value.trim();

        const response = await authAPI.login({ email, password });
        
        if (response.status === 'success') {
            setToken(response.token);
            setUser(response.user);
            
            Swal.fire({
                title: 'Success!',
                text: 'Login successful',
                icon: 'success'
            }).then(() => {
                if (response.user.role === 'Student') {
                    router.navigate('/student.html', true);
                } else {
                    router.navigate('/faculty.html', true);
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: response.message || 'Login failed',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
            title: 'Error',
            text: 'An error occurred during login',
            icon: 'error'
        });
    }
}

async function handleRegister(e) {
    e.preventDefault();
    try {
        const email = document.querySelector('#strEmail').value.trim();
        const password = document.querySelector('#strNewPassword').value.trim();
        const firstName = document.querySelector('#strFirstName').value.trim();
        const middleName = document.querySelector('#strMiddleName').value.trim();
        const lastName = document.querySelector('#strLastName').value.trim();
        const role = document.querySelector('#strRole').value;

        const response = await authAPI.register({
            email,
            password,
            firstName,
            middleName,
            lastName,
            role
        });

        if (response.status === 'success') {
            setToken(response.token);
            
            Swal.fire({
                title: 'Success!',
                text: 'Registration successful',
                icon: 'success'
            }).then(() => {
                if (role === 'Student') {
                    router.navigate('/student.html', true);
                } else {
                    router.navigate('/faculty.html', true);
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: response.message || 'Registration failed',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        Swal.fire({
            title: 'Error',
            text: 'An error occurred during registration',
            icon: 'error'
        });
    }
}

async function fetchSurveys() {
    try {
        const response = await surveyAPI.getSurveys();
        return response;
    } catch (error) {
        console.error('Error fetching surveys:', error);
        throw error;
    }
}

async function createSurvey(title, questions) {
    try {
        const response = await surveyAPI.createSurvey({ title, questions });
        return response;
    } catch (error) {
        console.error('Error creating survey:', error);
        throw error;
    }
}

async function fetchGroups() {
    try {
        const response = await groupAPI.getGroups();
        return response;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}

async function createGroup(name) {
    try {
        const response = await groupAPI.createGroup({ name });
        return response;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

function renderLogin(container) {
    container.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-center">Login</h3>
                        </div>
                        <div class="card-body">
                            <form id="loginForm">
                                <div class="form-group">
                                    <label for="strUsername">Email</label>
                                    <input type="email" class="form-control" id="strUsername" required>
                                </div>
                                <div class="form-group">
                                    <label for="strPassword">Password</label>
                                    <input type="password" class="form-control" id="strPassword" required>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block mt-4">Login</button>
                            </form>
                            <div class="text-center mt-3">
                                <p>Don't have an account? <a href="#" onclick="router.navigate('/register', true)">Register</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function renderRegister(container) {
    container.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-center">Register</h3>
                        </div>
                        <div class="card-body">
                            <form id="registerForm">
                                <div class="form-group">
                                    <label for="strEmail">Email</label>
                                    <input type="email" class="form-control" id="strEmail" required>
                                </div>
                                <div class="form-group">
                                    <label for="strFirstName">First Name</label>
                                    <input type="text" class="form-control" id="strFirstName" required>
                                </div>
                                <div class="form-group">
                                    <label for="strMiddleName">Middle Name</label>
                                    <input type="text" class="form-control" id="strMiddleName" required>
                                </div>
                                <div class="form-group">
                                    <label for="strLastName">Last Name</label>
                                    <input type="text" class="form-control" id="strLastName" required>
                                </div>
                                <div class="form-group">
                                    <label for="strNewPassword">Password</label>
                                    <input type="password" class="form-control" id="strNewPassword" required>
                                </div>
                                <div class="form-group">
                                    <label for="strConfirmPassword">Confirm Password</label>
                                    <input type="password" class="form-control" id="strConfirmPassword" required>
                                </div>
                                <div class="form-group">
                                    <label for="strRole">Role</label>
                                    <select class="form-control" id="strRole" required>
                                        <option value="">Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Faculty">Faculty</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block mt-4">Register</button>
                            </form>
                            <div class="text-center mt-3">
                                <p>Already have an account? <a href="#" onclick="router.navigate('/', true)">Login</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function renderStudentDashboard(container) {
    if (!isAuthenticated() || !isStudent()) {
        router.navigate('/', true);
        return;
    }
    
    const user = getUser();
    container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">TTU Group Survey</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnViewSurveys">View Surveys</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                Account
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" id="btnToProfile">Profile</a></li>
                                <li><a class="dropdown-item" href="#" id="btnToSettings">Settings</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="btnLogout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4">
            <h1>Welcome, ${user.firstName}!</h1>
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Active Surveys</h5>
                            <p class="card-text" id="activeSurveyCount">Loading...</p>
                            <button class="btn btn-primary" id="btnViewSurveys">View Surveys</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Your Groups</h5>
                            <p class="card-text" id="groupCount">Loading...</p>
                            <button class="btn btn-primary" id="btnViewGroups">View Groups</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
    // Add event listeners
    document.getElementById('btnViewSurveys').addEventListener('click', () => {
        // Show surveys modal
        const modal = new bootstrap.Modal(document.getElementById('viewSurveysModal'));
        modal.show();
    });
    
    document.getElementById('btnViewGroups').addEventListener('click', () => {
        // Show groups modal
        const modal = new bootstrap.Modal(document.getElementById('manageGroupsModal'));
        modal.show();
    });
    
    document.getElementById('btnToProfile').addEventListener('click', () => {
        router.navigate('/profile', true);
    });
    
    document.getElementById('btnToSettings').addEventListener('click', () => {
        router.navigate('/settings', true);
    });
    
    document.getElementById('btnLogout').addEventListener('click', logout);
    
    // Update counts
    updateActiveSurveyCount();
    updateGroupCount();
}

function renderFacultyDashboard(container) {
    if (!isAuthenticated() || !isFaculty()) {
        router.navigate('/', true);
        return;
    }
    
    const user = getUser();
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">TTU Group Survey</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnCreateSurvey">Create Survey</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnViewSurveys">View Surveys</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnManageGroups">Manage Groups</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                Account
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" id="btnToProfile">Profile</a></li>
                                <li><a class="dropdown-item" href="#" id="btnToSettings">Settings</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="btnLogout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4">
            <h1>Welcome, ${user.firstName}!</h1>
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Create Survey</h5>
                            <p class="card-text">Create a new survey for your students</p>
                            <button class="btn btn-primary" id="btnCreateSurveyCard">Create Survey</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">View Surveys</h5>
                            <p class="card-text">View and manage your surveys</p>
                            <button class="btn btn-primary" id="btnViewSurveysCard">View Surveys</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Manage Groups</h5>
                            <p class="card-text">Create and manage student groups</p>
                            <button class="btn btn-primary" id="btnManageGroupsCard">Manage Groups</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
    // Add event listeners
    document.getElementById('btnCreateSurvey').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
        modal.show();
    });
    
    document.getElementById('btnCreateSurveyCard').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('createSurveyModal'));
        modal.show();
    });
    
    document.getElementById('btnViewSurveys').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('viewSurveysModal'));
        modal.show();
    });
    
    document.getElementById('btnViewSurveysCard').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('viewSurveysModal'));
        modal.show();
    });
    
    document.getElementById('btnManageGroups').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('manageGroupsModal'));
        modal.show();
    });
    
    document.getElementById('btnManageGroupsCard').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('manageGroupsModal'));
        modal.show();
    });
    
    document.getElementById('btnToProfile').addEventListener('click', () => {
        router.navigate('/profile', true);
    });
    
    document.getElementById('btnToSettings').addEventListener('click', () => {
        router.navigate('/settings', true);
    });
    
    document.getElementById('btnLogout').addEventListener('click', logout);
}

function renderProfile(container) {
    const token = getToken();
    fetch('/profile', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(res => res.json())
    .then(userData => {
        container.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">TTU Group Survey</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="btnBackToDashboard">Back to Dashboard</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                Account
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item active" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#" id="btnToSettings">Settings</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" id="btnLogout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title mb-0">Profile Information</h3>
                        </div>
                        <div class="card-body">
                            <div class="row mb-3">
                                <div class="col-md-4"><strong>Email:</strong></div>
                                <div class="col-md-8">${userData.email}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-4"><strong>First Name:</strong></div>
                                <div class="col-md-8">${userData.FirstName}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-4"><strong>Last Name:</strong></div>
                                <div class="col-md-8">${userData.LastName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

// Settings page (simple placeholder)
function renderSettings(container) {
    container.innerHTML = `<div class="container mt-4"><h2>Settings</h2><p>Settings page coming soon.</p></div>`;
}

// Add logic for Create Survey, Add Group, Add Field, Create Group
// Example: dynamically add survey fields
function addSurveyField() {
    const container = document.getElementById('surveyFields');
    const field = document.createElement('input');
    field.type = 'text';
    field.className = 'form-control mb-2';
    field.placeholder = 'Survey Question';
    container.appendChild(field);
}

// Example: handle create survey
function handleCreateSurvey() {
    const questions = Array.from(document.querySelectorAll('#surveyFields input')).map(i => i.value);
    // TODO: send questions to backend
    Swal.fire({ title: 'Survey Created!', text: `Questions: ${questions.join(', ')}`, icon: 'success' });
}

// Example: handle create group
function handleCreateGroup() {
    const groupName = document.getElementById('groupName').value;
    // TODO: send groupName to backend
    Swal.fire({ title: 'Group Created!', text: `Group: ${groupName}`, icon: 'success' });
}

// Add event listeners for dashboard buttons (after rendering dashboard)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnAddField') addSurveyField();
    if (e.target && e.target.id === 'btnCreateSurvey') handleCreateSurvey();
    if (e.target && e.target.id === 'btnCreateGroup') handleCreateGroup();
    if (e.target && e.target.id === 'btnLogout') { removeToken(); router.navigate('/', true); }
    if (e.target && e.target.id === 'btnToSettings') router.navigate('/settings', true);
    if (e.target && e.target.id === 'btnBackToDashboard') router.navigate('/student', true);
});

// Export functions for use in other files
export {
    router,
    isAuthenticated,
    isFaculty,
    isStudent,
    logout,
    fetchSurveys,
    createSurvey,
    fetchGroups,
    createGroup
};