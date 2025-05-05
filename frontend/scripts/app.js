// Import bcrypt
const bcrypt = dcodeIO.bcrypt;

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
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log('Current user:', currentUser);
            
            if (currentUser) {
                if (currentUser.role === 'Student') {
                    console.log('Redirecting to student dashboard');
                    this.navigate('/student-dashboard', false);
                } else if (currentUser.role === 'Faculty') {
                    console.log('Redirecting to faculty dashboard');
                    this.navigate('/faculty-dashboard', false);
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
                if (isStudent()) {
                    console.log('User is student, redirecting to student dashboard');
                    router.navigate('/student-dashboard', true);
                } else {
                    console.log('User is faculty, redirecting to faculty dashboard');
                    router.navigate('/faculty-dashboard', true);
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

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function setCurrentUser(user) {
    try {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
        console.error('Error setting current user:', error);
    }
}

function removeCurrentUser() {
    try {
        localStorage.removeItem('currentUser');
    } catch (error) {
        console.error('Error removing current user:', error);
    }
}

function isAuthenticated() {
    try {
        return !!getCurrentUser();
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

function isFaculty() {
    try {
        const user = getCurrentUser();
        return user && user.role === 'Faculty';
    } catch (error) {
        console.error('Error checking faculty status:', error);
        return false;
    }
}

function isStudent() {
    try {
        const user = getCurrentUser();
        return user && user.role === 'Student';
    } catch (error) {
        console.error('Error checking student status:', error);
        return false;
    }
}

function logout() {
    try {
        console.log('Logging out user');
        removeToken();
        removeCurrentUser();
        router.navigate('/', false);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Login handler with error handling
async function handleLogin(e) {
    try {
        console.log('Handling login');
        e.preventDefault();
        
        const email = document.querySelector("#strUsername").value.trim();
        const password = document.querySelector("#strPassword").value.trim();
        console.log('Login attempt for email:', email);

        // For demo purposes - replace with actual backend call
        const mockUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Invalid password');
        }

        // Set user session
        setCurrentUser(user);
        setToken('mock-token');

        // Navigate based on role
        if (user.role === 'Student') {
            router.navigate('/student-dashboard');
        } else {
            router.navigate('/faculty-dashboard');
        }

    } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message
        });
    }
}

// Registration handler with error handling
async function handleRegister(e) {
    try {
        console.log('Handling registration');
        e.preventDefault();

        const firstName = document.querySelector("#strFirstName").value.trim();
        const middleName = document.querySelector("#strMiddleName").value.trim();
        const lastName = document.querySelector("#strLastName").value.trim();
        const email = document.querySelector("#strEmail").value.trim();
        const role = document.querySelector("#strRole").value;
        const password = document.querySelector("#strNewPassword").value;
        const confirmPassword = document.querySelector("#strConfirmPassword").value;

        console.log('Registering user with role:', role);

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newUser = {
            firstName,
            middleName,
            lastName,
            email,
            role,
            password: hashedPassword
        };

        // For demo purposes - store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            throw new Error('Email already registered');
        }
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Set current user and token
        setCurrentUser(newUser);
        setToken('mock-token');

        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been registered successfully!'
        });

        // Navigate based on role
        if (role === 'Student') {
            router.navigate('/student-dashboard');
        } else {
            router.navigate('/faculty-dashboard');
        }

    } catch (error) {
        console.error('Registration error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message
        });
    }
}

// On load, check for JWT and route accordingly
window.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    if (token) {
        // Try to fetch profile, if valid, go to dashboard
        fetch('/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(profile => {
            // Choose dashboard based on profile or default to student
            if (profile && profile.email) {
                router.navigate('/student', true);
            } else {
                router.navigate('/', true);
            }
        })
        .catch(() => {
            removeToken();
            router.navigate('/', true);
        });
    } else {
        router.navigate('/', true);
    }
});

// --- Survey and Group API helpers ---
function fetchSurveys() {
    return fetch('/surveys', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(res => res.json());
}
function createSurvey(title, questions) {
    return fetch('/survey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ title, questions })
    }).then(res => res.json());
}
function fetchGroups() {
    return fetch('/groups', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then(res => res.json());
}
function createGroup(name) {
    return fetch('/group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ name })
    }).then(res => res.json());
}

// Component functions
function renderLogin(container) {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        router.navigate(user.role === 'Student' ? '/student-dashboard' : '/faculty-dashboard', true);
        return;
    }
    
    container.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h2 class="text-center mb-4">Login</h2>
                            <form id="frmLogin">
                                <div class="mb-3">
                                    <label for="strUsername" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="strUsername" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="strPassword" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100" id="btnLogin">Login</button>
                                <div class="text-center mt-3">
                                    <button type="button" class="btn btn-link" id="btnSwap">Don't have an account? Register</button>
                                </div>
                            </form>
                            <form id="frmRegister" style="display: none;">
                                <div class="mb-3">
                                    <label for="strFirstName" class="form-label">First Name</label>
                                    <input type="text" class="form-control" id="strFirstName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strMiddleName" class="form-label">Middle Name</label>
                                    <input type="text" class="form-control" id="strMiddleName">
                                </div>
                                <div class="mb-3">
                                    <label for="strLastName" class="form-label">Last Name</label>
                                    <input type="text" class="form-control" id="strLastName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="strEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strNewPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="strNewPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strConfirmPassword" class="form-label">Confirm Password</label>
                                    <input type="password" class="form-control" id="strConfirmPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label for="strRole" class="form-label">Role</label>
                                    <select class="form-select" id="strRole" required>
                                        <option value="">Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Faculty">Faculty</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary w-100" id="btnRegister">Register</button>
                                <div class="text-center mt-3">
                                    <button type="button" class="btn btn-link" id="btnBack">Already have an account? Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
    // Add event listeners
    document.getElementById('btnLogin').addEventListener('click', handleLogin);
    document.getElementById('btnRegister').addEventListener('click', handleRegister);
    document.getElementById('btnSwap').addEventListener('click', () => {
        document.getElementById('frmLogin').style.display = 'none';
        document.getElementById('frmRegister').style.display = 'block';
    });
    document.getElementById('btnBack').addEventListener('click', () => {
        document.getElementById('frmLogin').style.display = 'block';
        document.getElementById('frmRegister').style.display = 'none';
    });
}

function renderRegister(container) {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        router.navigate(user.role === 'Student' ? '/student' : '/faculty', true);
        return;
    }
    
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
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="firstName" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="middleName" class="form-label">Middle Name</label>
                                        <input type="text" class="form-control" id="middleName">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="lastName" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" required>
                                </div>
                                <div class="mb-3">
                                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                                    <input type="password" class="form-control" id="confirmPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label for="role" class="form-label">Role</label>
                                    <select class="form-select" id="role" required>
                                        <option value="">Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Faculty">Faculty</option>
                                    </select>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Register</button>
                                </div>
                            </form>
                            <div class="text-center mt-3">
                                <p>Already have an account? <a href="#" id="btnToLogin">Login</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
    // Add event listeners
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('btnToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/', true);
    });
}

function renderStudentDashboard(container) {
    if (!isAuthenticated() || !isStudent()) {
        router.navigate('/', true);
        return;
    }
    
    const user = getCurrentUser();
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
    
    const user = getCurrentUser();
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