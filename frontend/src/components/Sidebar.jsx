import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            <div
                className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">HR</div>
                        <div className="sidebar-logo-text">
                            <h1>HRMS Lite</h1>
                            <span>Management</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon size={20} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <ThemeToggle />
                </div>

                {mobileOpen && (
                    <button
                        className="mobile-menu-btn"
                        style={{ position: 'absolute', top: 16, right: 16, left: 'auto', display: 'flex' }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <X size={20} />
                    </button>
                )}
            </aside>
        </>
    );
}
