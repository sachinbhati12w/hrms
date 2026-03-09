import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, message, action }) {
    return (
        <div className="empty-state animate-fade-in">
            {Icon && (
                <div className="empty-state-icon">
                    <Icon size={36} />
                </div>
            )}
            <h3>{title}</h3>
            <p>{message}</p>
            {action && action}
        </div>
    );
}
