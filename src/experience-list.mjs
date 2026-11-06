import { escape } from './layout.mjs';

// Dates and responsibilities are supplied in more_stuff/experiences.md.
export const modelling = [
  { id: '70-chilling', name: '70.chilling', year: '2024', roles: ['Lifestyle modelling'] },
  { id: 'max-wong', name: 'Max Wong Studio', year: '2025, 2026', roles: ['Lifestyle modelling'] },
  { id: 'whitefire', name: 'Whitefire', year: '2026', roles: ['Fashion jewellery modelling'] },
  { id: 'cp-modelling', name: 'CP Foods', year: '2026', roles: ['Fashion modelling'], href: '#cp-foods', dialog: 'dialog-tep' },
];
export const otherWork = [
  { id: 'tutor', name: 'Private Tutor', year: '2019–2020', roles: ['Tutoring'], address: '920 Tiong Bahru Rd, Singapore 158792' },
  { id: 'innoquest', name: 'Innoquest', year: '2023', roles: ['Phlebotomist assistant'], address: '67 Ubi Ave 1, Singapore 408942' },
  { id: 'officemate', name: 'Officemate', year: '2023', roles: ['Logistics'], address: '6 Eu Tong Sen Street, Clarke Quay Central, Singapore 059817' },
];

export function experienceList(entries) {
  const ordered = [...entries].sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10) || a.name.localeCompare(b.name));
  return `<div class="experience-list">${ordered.map(entry => `<details class="experience-entry" data-experience-roles="${escape(JSON.stringify(entry.roles))}">
    <summary><span>${escape(entry.name)}</span><span class="experience-date">${escape(entry.year)}</span></summary>
    <div class="experience-entry-body"><ul class="experience-roles" aria-label="Roles">${entry.roles.map(role => `<li>${escape(role)}</li>`).join('')}</ul>
    ${entry.address ? `<p>${escape(entry.address)}</p>` : ''}
    ${entry.summary ? `<p>${escape(entry.summary)}</p>` : ''}
    ${entry.coordinates ? `<a class="venue-directions text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${entry.coordinates[1]},${entry.coordinates[0]}`)}" target="_blank" rel="noopener noreferrer" aria-label="Find ${escape(entry.name)} on Google Maps">View location ↗</a>` : ''}
    ${entry.href ? `<a class="text-link" href="${entry.href}"${entry.dialog ? ` data-dialog="${entry.dialog}" data-dialog-target="${entry.href.slice(1)}"` : ''}>View campaign ↗</a>` : ''}</div>
  </details>`).join('')}</div>`;
}

export function additionalExperience() {
  return `<div class="additional-experience">
    <section aria-labelledby="modelling-heading"><h3 id="modelling-heading">Modelling &amp; Shoots</h3><p>Lifestyle, fashion and campaign work.</p>${experienceList(modelling)}</section>
    <section aria-labelledby="other-work-heading"><h3 id="other-work-heading">Other Work</h3><p>Earlier experience in education, healthcare and logistics.</p>${experienceList(otherWork)}</section>
  </div>`;
}
