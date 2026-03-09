import { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle, UserCheck, UserX } from 'lucide-react';
import { getEmployees, markAttendance } from '../api/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import './Attendance.css';

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: '',
    });
    const [lastMarked, setLastMarked] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees();
            setEmployees(data.employees);
        } catch (err) {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setLastMarked(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.employee_id) {
            toast.error('Please select an employee');
            return;
        }
        if (!form.date) {
            toast.error('Please select a date');
            return;
        }
        if (!form.status) {
            toast.error('Please select attendance status');
            return;
        }

        try {
            setSubmitting(true);
            await markAttendance(form);
            const emp = employees.find(e => e.employee_id === form.employee_id);
            setLastMarked({
                name: emp?.full_name || form.employee_id,
                date: form.date,
                status: form.status,
            });
            toast.success('Attendance marked successfully!');
            setForm(prev => ({ ...prev, employee_id: '', status: '' }));
        } catch (err) {
            const message = err.response?.data?.detail || 'Failed to mark attendance';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader text="Loading employees..." />;

    return (
        <div className="attendance-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mark Attendance</h1>
                    <p className="page-subtitle">Record daily attendance for employees</p>
                </div>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon={CalendarCheck}
                    title="No employees"
                    message="Add employees first before marking attendance."
                />
            ) : (
                <div className="attendance-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="attendance-form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="att-employee">Employee</label>
                                <select
                                    id="att-employee"
                                    className="form-select"
                                    name="employee_id"
                                    value={form.employee_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name} ({emp.employee_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="att-date">Date</label>
                                <input
                                    id="att-date"
                                    type="date"
                                    className="form-input"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="att-status">Status</label>
                                <select
                                    id="att-status"
                                    className="form-select"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Present">✅ Present</option>
                                    <option value="Absent">❌ Absent</option>
                                </select>
                            </div>
                        </div>

                        <div className="mark-btn-wrapper">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                <CalendarCheck size={18} />
                                {submitting ? 'Marking...' : 'Mark Attendance'}
                            </button>
                        </div>
                    </form>

                    {lastMarked && (
                        <div className="attendance-success">
                            <CheckCircle size={20} />
                            Attendance marked: <strong>{lastMarked.name}</strong> was&nbsp;
                            <span className={`badge badge-${lastMarked.status.toLowerCase()}`}>
                                {lastMarked.status}
                            </span>
                            &nbsp;on {lastMarked.date}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
