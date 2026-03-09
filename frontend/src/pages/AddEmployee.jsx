import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { createEmployee } from '../api/api';
import toast from 'react-hot-toast';
import './AddEmployee.css';

const DEPARTMENTS = [
    'Engineering',
    'Human Resources',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Design',
    'Product',
    'Legal',
    'Support',
];

export default function AddEmployee() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!form.employee_id.trim()) {
            newErrors.employee_id = 'Employee ID is required';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(form.employee_id)) {
            newErrors.employee_id = 'Only alphanumeric characters, hyphens and underscores';
        }

        if (!form.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        } else if (form.full_name.trim().length < 2) {
            newErrors.full_name = 'Name must be at least 2 characters';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!form.department) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            await createEmployee({
                ...form,
                employee_id: form.employee_id.trim(),
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
            });
            toast.success('Employee added successfully!');
            navigate('/employees');
        } catch (err) {
            const message = err.response?.data?.detail || 'Failed to add employee';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-employee-page animate-fade-in">
            <div className="page-header">
                <div>
                    <button className="btn btn-ghost" onClick={() => navigate('/employees')} style={{ marginBottom: 8 }}>
                        <ArrowLeft size={18} />
                        Back to Employees
                    </button>
                    <h1 className="page-title">Add New Employee</h1>
                    <p className="page-subtitle">Fill in the details to register a new employee</p>
                </div>
            </div>

            <form className="add-employee-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="employee_id">Employee ID</label>
                        <input
                            id="employee_id"
                            className="form-input"
                            type="text"
                            name="employee_id"
                            placeholder="e.g. EMP001"
                            value={form.employee_id}
                            onChange={handleChange}
                        />
                        {errors.employee_id && <p className="form-error">{errors.employee_id}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="full_name">Full Name</label>
                        <input
                            id="full_name"
                            className="form-input"
                            type="text"
                            name="full_name"
                            placeholder="e.g. John Doe"
                            value={form.full_name}
                            onChange={handleChange}
                        />
                        {errors.full_name && <p className="form-error">{errors.full_name}</p>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="e.g. john@company.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="department">Department</label>
                        <select
                            id="department"
                            className="form-select"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {errors.department && <p className="form-error">{errors.department}</p>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => navigate('/employees')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        <Save size={18} />
                        {submitting ? 'Adding...' : 'Add Employee'}
                    </button>
                </div>
            </form>
        </div>
    );
}
