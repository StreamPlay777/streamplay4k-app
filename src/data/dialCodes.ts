/**
 * Country calling codes for the order form.
 *
 * WHY A LIST AND NOT A LIBRARY
 * libphonenumber and friends weigh 150kB+ and exist to *parse and format*
 * numbers per country. This form does neither — it validates on digit count
 * (see pricing/validation.ts) and passes the number through to a human who
 * will WhatsApp it. All that is needed is a prefix the customer does not have
 * to type and cannot get wrong.
 *
 * ORDER: the markets we actually sell to first, then alphabetical. A US
 * customer — most of them — finds their code without opening the list at all,
 * because it is already selected.
 *
 * The label carries a flag rather than the country name so the closed control
 * stays narrow enough to sit beside the number on a 320px screen. Windows
 * renders regional-indicator pairs as letters instead of a flag, which gives
 * "US +1" — still correct, and it makes keyboard type-ahead work there.
 * `name` is what the hint line under the field says out loud, so the country
 * is always stated in words somewhere.
 */

export interface DialCode {
  /** ISO 3166-1 alpha-2 — the stable key, and what Windows shows in place of the flag. */
  iso: string;
  name: string;
  /** With the +, as it appears in the field and in the submitted number. */
  dial: string;
  flag: string;
}

export const DIAL_CODES: DialCode[] = [
  { iso: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸' },
  { iso: 'CA', name: 'Canada',         dial: '+1',   flag: '🇨🇦' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧' },
  { iso: 'AU', name: 'Australia',      dial: '+61',  flag: '🇦🇺' },
  { iso: 'IE', name: 'Ireland',        dial: '+353', flag: '🇮🇪' },
  { iso: 'NZ', name: 'New Zealand',    dial: '+64',  flag: '🇳🇿' },

  { iso: 'AR', name: 'Argentina',      dial: '+54',  flag: '🇦🇷' },
  { iso: 'AT', name: 'Austria',        dial: '+43',  flag: '🇦🇹' },
  { iso: 'BE', name: 'Belgium',        dial: '+32',  flag: '🇧🇪' },
  { iso: 'BR', name: 'Brazil',         dial: '+55',  flag: '🇧🇷' },
  { iso: 'CL', name: 'Chile',          dial: '+56',  flag: '🇨🇱' },
  { iso: 'CO', name: 'Colombia',       dial: '+57',  flag: '🇨🇴' },
  { iso: 'CZ', name: 'Czechia',        dial: '+420', flag: '🇨🇿' },
  { iso: 'DK', name: 'Denmark',        dial: '+45',  flag: '🇩🇰' },
  { iso: 'DO', name: 'Dominican Rep.', dial: '+1',   flag: '🇩🇴' },
  { iso: 'EG', name: 'Egypt',          dial: '+20',  flag: '🇪🇬' },
  { iso: 'FI', name: 'Finland',        dial: '+358', flag: '🇫🇮' },
  { iso: 'FR', name: 'France',         dial: '+33',  flag: '🇫🇷' },
  { iso: 'DE', name: 'Germany',        dial: '+49',  flag: '🇩🇪' },
  { iso: 'GR', name: 'Greece',         dial: '+30',  flag: '🇬🇷' },
  { iso: 'HK', name: 'Hong Kong',      dial: '+852', flag: '🇭🇰' },
  { iso: 'IN', name: 'India',          dial: '+91',  flag: '🇮🇳' },
  { iso: 'ID', name: 'Indonesia',      dial: '+62',  flag: '🇮🇩' },
  { iso: 'IL', name: 'Israel',         dial: '+972', flag: '🇮🇱' },
  { iso: 'IT', name: 'Italy',          dial: '+39',  flag: '🇮🇹' },
  { iso: 'JM', name: 'Jamaica',        dial: '+1',   flag: '🇯🇲' },
  { iso: 'JP', name: 'Japan',          dial: '+81',  flag: '🇯🇵' },
  { iso: 'JO', name: 'Jordan',         dial: '+962', flag: '🇯🇴' },
  { iso: 'KE', name: 'Kenya',          dial: '+254', flag: '🇰🇪' },
  { iso: 'KW', name: 'Kuwait',         dial: '+965', flag: '🇰🇼' },
  { iso: 'LB', name: 'Lebanon',        dial: '+961', flag: '🇱🇧' },
  { iso: 'MY', name: 'Malaysia',       dial: '+60',  flag: '🇲🇾' },
  { iso: 'MX', name: 'Mexico',         dial: '+52',  flag: '🇲🇽' },
  { iso: 'MA', name: 'Morocco',        dial: '+212', flag: '🇲🇦' },
  { iso: 'NL', name: 'Netherlands',    dial: '+31',  flag: '🇳🇱' },
  { iso: 'NG', name: 'Nigeria',        dial: '+234', flag: '🇳🇬' },
  { iso: 'NO', name: 'Norway',         dial: '+47',  flag: '🇳🇴' },
  { iso: 'PK', name: 'Pakistan',       dial: '+92',  flag: '🇵🇰' },
  { iso: 'PA', name: 'Panama',         dial: '+507', flag: '🇵🇦' },
  { iso: 'PE', name: 'Peru',           dial: '+51',  flag: '🇵🇪' },
  { iso: 'PH', name: 'Philippines',    dial: '+63',  flag: '🇵🇭' },
  { iso: 'PL', name: 'Poland',         dial: '+48',  flag: '🇵🇱' },
  { iso: 'PT', name: 'Portugal',       dial: '+351', flag: '🇵🇹' },
  { iso: 'QA', name: 'Qatar',          dial: '+974', flag: '🇶🇦' },
  { iso: 'RO', name: 'Romania',        dial: '+40',  flag: '🇷🇴' },
  { iso: 'SA', name: 'Saudi Arabia',   dial: '+966', flag: '🇸🇦' },
  { iso: 'SG', name: 'Singapore',      dial: '+65',  flag: '🇸🇬' },
  { iso: 'ZA', name: 'South Africa',   dial: '+27',  flag: '🇿🇦' },
  { iso: 'KR', name: 'South Korea',    dial: '+82',  flag: '🇰🇷' },
  { iso: 'ES', name: 'Spain',          dial: '+34',  flag: '🇪🇸' },
  { iso: 'SE', name: 'Sweden',         dial: '+46',  flag: '🇸🇪' },
  { iso: 'CH', name: 'Switzerland',    dial: '+41',  flag: '🇨🇭' },
  { iso: 'TH', name: 'Thailand',       dial: '+66',  flag: '🇹🇭' },
  { iso: 'TT', name: 'Trinidad & Tob.',dial: '+1',   flag: '🇹🇹' },
  { iso: 'TR', name: 'Türkiye',        dial: '+90',  flag: '🇹🇷' },
  { iso: 'AE', name: 'United Arab Em.',dial: '+971', flag: '🇦🇪' },
  { iso: 'VN', name: 'Vietnam',        dial: '+84',  flag: '🇻🇳' },
];

export const DEFAULT_DIAL_ISO = 'US';

export function dialCodeFor(iso: string): DialCode {
  return DIAL_CODES.find((c) => c.iso === iso) ?? DIAL_CODES[0];
}

/**
 * The number as it is submitted: "+1 2125550123".
 *
 * Kept in one place because the confirm step, the payload and the validation
 * must all see the same string. Somewhere reading the national part alone is
 * how a form ends up telling the customer their number is fine and sending the
 * server one it rejects.
 */
export function composePhone(iso: string, national: string): string {
  const n = national.trim();
  return n ? `${dialCodeFor(iso).dial} ${n}` : '';
}
