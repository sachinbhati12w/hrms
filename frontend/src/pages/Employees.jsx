import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Mail, Building2, Trash2, Eye, Users, AlertTriangle } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../api/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import './Employees.css';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEmployees();
            setEmployees(data.employees);
        } catch (err) {
            setError('Failed to load employees. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await deleteEmployee(deleteTarget.employee_id);
            toast.success(`Employee "${deleteTarget.full_name}" deleted successfully`);
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete employee');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) return <Loader text="Loading employees..." />;

    if (error) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Failed to Load"
                message={error}
                action={<button className="btn btn-primary" onClick={fetchEmployees}>Retry</button>}
            />
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">{employees.length} total employees</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/employees/add')}>
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            {employees.length > 0 && (
                <div className="employees-toolbar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, department, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {employees.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No employees yet"
                    message="Start by adding your first employee to the system."
                    action={
                        <button className="btn btn-primary" onClick={() => navigate('/employees/add')}>
                            <Plus size={18} />
                            Add Employee
                        </button>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={Search}
                    title="No results found"
                    message={`No employees match "${search}". Try a different search term.`}
                />
            ) : (
                <div className="employee-grid">
                    {filtered.map((emp) => (
                        <div key={emp._id} className="employee-card" onClick={() => navigate(`/employees/${emp.employee_id}`)}>
                            <div className="employee-card-header">
                                <div className="employee-avatar">{getInitials(emp.full_name)}</div>
                                <div>
                                    <div className="employee-card-name">{emp.full_name}</div>
                                    <div className="employee-card-id">{emp.employee_id}</div>
                                </div>
                            </div>
                            <div className="employee-card-details">
                                <div className="employee-card-detail">
                                    <Mail size={14} />
                                    {emp.email}
                                </div>
                                <div className="employee-card-detail">
                                    <Building2 size={14} />
                                    {emp.department}
                                </div>
                            </div>
                            <div className="employee-card-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/employees/${emp.employee_id}`); }}
                                >
                                    <Eye size={15} />
                                    View
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ color: 'var(--danger)' }}
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(emp); }}
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteTarget && (
                <Modal onClose={() => setDeleteTarget(null)}>
                    <div className="modal-icon danger">
                        <AlertTriangle size={24} />
                    </div>
                    <h3>Delete Employee</h3>
                    <p>
                        Are you sure you want to delete <strong>{deleteTarget.full_name}</strong> ({deleteTarget.employee_id})?
                        This will also remove all their attendance records. This action cannot be undone.
                    </p>
                    <div className="modal-actions">
                        <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete Employee'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
