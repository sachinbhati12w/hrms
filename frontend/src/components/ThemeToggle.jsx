import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <div className={`theme-toggle-track ${theme}`}>
                <div className="theme-toggle-thumb" />
            </div>
            <span className="theme-toggle-label">
                {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </span>
        </button>
    );
}
