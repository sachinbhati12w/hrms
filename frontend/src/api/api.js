import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =================== EMPLOYEES ===================

export const getEmployees = async () => {
    const response = await api.get('/api/employees');
    return response.data;
};

export const getEmployee = async (employeeId) => {
    const response = await api.get(`/api/employees/${employeeId}`);
    return response.data;
};

export const createEmployee = async (employeeData) => {
    const response = await api.post('/api/employees', employeeData);
    return response.data;
};

export const deleteEmployee = async (employeeId) => {
    const response = await api.delete(`/api/employees/${employeeId}`);
    return response.data;
};

// =================== ATTENDANCE ===================

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
};

export const getAttendance = async (employeeId, dateFrom, dateTo) => {
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    const response = await api.get(`/api/attendance/${employeeId}`, { params });
    return response.data;
};

// =================== DASHBOARD ===================

export const getDashboard = async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
};

export default api;
