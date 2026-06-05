export default function StatusBadge({ status }) {
  const config = {
    available:   { label: 'Available',   bg: 'bg-green-light',  text: 'text-green-status' },
    occupied:    { label: 'Occupied',    bg: 'bg-red-light',    text: 'text-red-status' },
    reserved:    { label: 'Reserved',    bg: 'bg-amber-light',  text: 'text-amber-status' },
    maintenance: { label: 'Maintenance', bg: 'bg-slate-light',  text: 'text-slate-status' },
  };

  const c = config[status] || config.maintenance;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`status-dot status-dot--${status}`} />
      {c.label}
    </span>
  );
}
