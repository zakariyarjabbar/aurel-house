import type { Reservation } from './types';
export function calendarFile(reservation: Reservation) {
  const compact = (value: string) => value.replaceAll('-', '');
  const stamp = reservation.createdAt.replaceAll('-', '').replaceAll(':', '').replace(/\.\d+Z$/, 'Z');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aurel House//Browser-only Demo//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${reservation.ref}@aurel-house.example`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${compact(reservation.arrival)}`, `DTEND;VALUE=DATE:${compact(reservation.departure)}`, 'SUMMARY:DEMO - Aurel House stay (no real reservation)', 'DESCRIPTION:Portfolio demonstration only. No room is reserved.', ' No payment is taken. Times use Europe/Athens.', 'STATUS:TENTATIVE', 'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
}
export function downloadText(filename: string, contents: string, type = 'text/plain') { const blob = new Blob([contents], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
