"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  accent?: "primary" | "secondary" | "tertiary";
}

export function StatsCard({ label, value, icon, accent = "primary" }: StatsCardProps) {
  const accentStyles = {
    primary: "stats-card-primary",
    secondary: "stats-card-secondary",
    tertiary: "stats-card-tertiary",
  };

  return (
    <div className={`stats-card ${accentStyles[accent]}`}>
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <div className="text-headline-lg-mobile font-display">{value}</div>
      <div className="text-label mt-1 opacity-80">
        {label}
      </div>
    </div>
  );
}
