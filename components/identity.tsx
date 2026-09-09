export function Emblem({ className = '' }: { className?: string }) {
  return <svg className={`emblem ${className}`} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M16 35a16 16 0 0 1 32 0M9 35h46M9 43c8-7 15 7 23 0s15 7 23 0M15 51c6-5 11 5 17 0s11 5 17 0M32 6v7M12 15l5 5M52 15l-5 5M3 28l7 2M61 28l-7 2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
