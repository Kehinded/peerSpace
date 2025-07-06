import type { LucideIcon } from "lucide-react";
import "../../styles/fragment/EmptyState.css";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className="empty-state-reusable-wrap-index-box">
      <div className={`empty-state-reusable-wrap-index ${className}`}>
        {Icon && (
          <div className="empty-state-reusable-wrap-index__icon-container">
            <Icon className="empty-state-reusable-wrap-index__icon" />
          </div>
        )}
        <h3 className="empty-state-reusable-wrap-index__title">{title}</h3>
        {description && (
          <p className="empty-state-reusable-wrap-index__description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
