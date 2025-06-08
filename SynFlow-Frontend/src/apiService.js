// services/apiService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const PhaseAPI = {
    async getByForage(forageId) {
        const response = await fetch(`${API_BASE_URL}/phases/forage/${forageId}`);
        return await response.json();
    },

    async create(phaseData) {
        const response = await fetch(`${API_BASE_URL}/phases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phaseData),
        });
        return await response.json();
    }
};

export const OperationAPI = {
    async getByPhase(phaseId) {
        const response = await fetch(`${API_BASE_URL}/operations/phase/${phaseId}`);
        return await response.json();
    },

    async create(operationData) {
        const response = await fetch(`${API_BASE_URL}/operations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operationData),
        });
        return await response.json();
    }
};