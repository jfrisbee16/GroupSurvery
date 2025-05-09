const API_BASE_URL = 'http://localhost:8000';

// Auth API calls
export const authAPI = {
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        return data;
    }
};

// Survey API calls
export const surveyAPI = {
    async createSurvey(surveyData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/survey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(surveyData)
        });
        return response.json();
    },

    async getSurveys() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/surveys`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

// Group API calls
export const groupAPI = {
    async createGroup(groupData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(groupData)
        });
        return response.json();
    },

    async getGroups() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/groups`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
}; 