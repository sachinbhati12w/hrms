import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Building2, Hash, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { getEmployee, getAttendance } from '../api/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './EmployeeDetail.css';

export default function EmployeeDetail() {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        fetchData();
    }, [employeeId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [empData, attData] = await Promise.all([
                getEmployee(employeeId),
                getAttendance(employeeId),
            ]);
            setEmployee(empData);
            setAttendance(attData);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employee details.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        try {
            const attData = await getAttendance(employeeId, dateFrom || undefined, dateTo || undefined);
            setAttendance(attData);
        } catch (err) {
            // silently fail filter
        }
    };

    const clearFilter = async () => {
        setDateFrom('');
        setDateTo('');
        const attData = await getAttendance(employeeId);
        setAttendance(attData);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) return <Loader text="Loading employee details..." />;

    if (error) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Error"
                message={error}
                action={
                    <button className="btn btn-ghost" onClick={() => navigate('/employees')}>
                        <ArrowLeft size={18} />
                        Back to Employees
                    </button>
                }
            />
        );
    }

    return (
        <div className="animate-fade-in">
            <button className="btn btn-ghost" onClick={() => navigate('/employees')} style={{ marginBottom: 16 }}>
                <ArrowLeft size={18} />
                Back to Employees
            </button>

            <div className="card" style={{ marginBottom: 24 }}>
                <div className="employee-detail-header">
                    <div className="employee-detail-avatar">{getInitials(employee.full_name)}</div>
                    <div className="employee-detail-info">
                        <h2>{employee.full_name}</h2>
                        <div className="detail-meta">
                            <div className="detail-meta-item">
                                <Hash size={14} />
                                {employee.employee_id}
                            </div>
                            <div className="detail-meta-item">
                                <Mail size={14} />
                                {employee.email}
                            </div>
                            <div className="detail-meta-item">
                                <Building2 size={14} />
                                {employee.department}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-header" style={{ marginBottom: 16 }}>
                <h2 className="page-title" style={{ fontSize: 20 }}>
                    <Calendar size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Attendance Records
                </h2>
            </div>

            {attendance && (
                <div className="attendance-stats">
                    <div className="att-stat">
                        <div className="att-stat-value total">{attendance.total}</div>
                        <div className="att-stat-label">Total Records</div>
                    </div>
                    <div className="att-stat">
                        <div className="att-stat-value present">{attendance.present_count}</div>
                        <div className="att-stat-label">Present Days</div>
                    </div>
                    <div className="att-stat">
                        <div className="att-stat-value absent">{attendance.absent_count}</div>
                        <div className="att-stat-label">Absent Days</div>
                    </div>
                </div>
            )}

            <div className="attendance-controls">
                <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleFilter}>
                    <Filter size={15} />
                    Filter
                </button>
                {(dateFrom || dateTo) && (
                    <button className="btn btn-ghost btn-sm" onClick={clearFilter}>
                        Clear
                    </button>
                )}
            </div>

            {attendance && attendance.records.length > 0 ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.records.map((record) => (
                                <tr key={record._id}>
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
            ) : (
                <EmptyState
                    icon={Calendar}
                    title="No attendance records"
                    message="No attendance has been marked for this employee yet."
                />
            )}
        </div>
    );
}
