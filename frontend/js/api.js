const API_BASE_URL = 'http://localhost:5000/api';

// Auth API calls
export const authAPI = {
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return response.json();
    }
};

// Survey API calls
export const surveyAPI = {
    async createSurvey(surveyData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/surveys`, {
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
    },

    async deleteSurvey(surveyId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
            method: 'DELETE',
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
        const response = await fetch(`${API_BASE_URL}/groups`, {
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
    },

    async deleteGroup(groupId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
}; 