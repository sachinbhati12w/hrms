import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, Building2, Activity } from 'lucide-react';
import { getDashboard } from '../api/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getDashboard();
            setData(result);
        } catch (err) {
            setError('Failed to load dashboard data. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader text="Loading dashboard..." />;

    if (error) {
        return (
            <EmptyState
                icon={Activity}
                title="Connection Error"
                message={error}
                action={<button className="btn btn-primary" onClick={fetchDashboard}>Retry</button>}
            />
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your HR management system</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{data.total_employees ?? 0}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">
                        <UserCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{data.today_present ?? 0}</h3>
                        <p>Present Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon danger">
                        <UserX size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{data.today_absent ?? 0}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon warning">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{data.today_unmarked ?? 0}</h3>
                        <p>Unmarked Today</p>
                    </div>
                </div>
            </div>

            {data.departments?.length > 0 && (
                <div className="dashboard-section">
                    <h2 className="dashboard-section-title">
                        <Building2 size={20} />
                        Department Distribution
                    </h2>
                    <div className="dept-list">
                        {data.departments.map((dept) => (
                            <div key={dept.department} className="dept-item">
                                <span className="dept-name">{dept.department}</span>
                                <span className="dept-count">{dept.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.recent_attendance?.length > 0 && (
                <div className="dashboard-section recent-section">
                    <h2 className="dashboard-section-title">
                        <Activity size={20} />
                        Recent Attendance
                    </h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent_attendance.map((record) => (
                                    <tr key={record._id}>
                                        <td style={{ fontWeight: 500 }}>{record.employee_name}</td>
                                        <td><span className="badge badge-info">{record.employee_id}</span></td>
                                        <td>{record.date}</td>
                                        <td>
                                            <span className={`badge badge-${record.status.toLowerCase()}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
