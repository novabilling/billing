/** Country calling codes for the mobile money markets we integrate with. */
const DIAL_CODES: Record<string, string> = {
  UG: '256', KE: '254', TZ: '255', RW: '250', ZM: '260', MW: '265', NG: '234', GH: '233',
  CD: '243', CG: '242', MG: '261', NE: '227', TD: '235', GA: '241', SC: '248', CM: '237',
  CI: '225', BJ: '229', GN: '224', LR: '231', SZ: '268', ZA: '27', SS: '211',
};

/** MTN target environments ("mtnuganda") to ISO country codes. */
export const MTN_MARKETS: Record<string, string> = {
  sandbox: 'UG', mtnuganda: 'UG', mtnghana: 'GH', mtnivorycoast: 'CI', mtnzambia: 'ZM', mtncameroon: 'CM',
  mtnbenin: 'BJ', mtncongo: 'CG', mtnswaziland: 'SZ', mtnguineaconakry: 'GN', mtnsouthafrica: 'ZA',
  mtnliberia: 'LR', mtnrwanda: 'RW', mtnsouthsudan: 'SS',
};

export function dialCode(country: string): string | undefined {
  return DIAL_CODES[country.toUpperCase()];
}

/**
 * Normalise a phone number to international digits without "+":
 * "0772 123 456" in UG → "256772123456". Numbers already carrying the
 * country code are left as they are.
 */
export function toInternational(raw: string, country: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  const code = dialCode(country);
  if (!code) return digits;
  if (digits.startsWith('0')) return code + digits.slice(1);
  if (!digits.startsWith(code) && digits.length <= 9) return code + digits;
  return digits;
}

/** National significant number (no country code, no leading 0), as Airtel expects. */
export function toNational(raw: string, country: string): string {
  const international = toInternational(raw, country);
  const code = dialCode(country);
  return code && international.startsWith(code) ? international.slice(code.length) : international.replace(/^0/, '');
}

/**
 * Mobile network of a number from its prefix, where known (Uganda for now:
 * MTN 76/77/78/39, Airtel 70/74/75/20). Used to send a mobile money payment
 * to the operator's own API when that operator is connected.
 */
export function detectNetwork(raw: string, country = 'UG'): 'MTN' | 'AIRTEL' | undefined {
  if (country.toUpperCase() !== 'UG') return undefined;
  const national = toNational(raw, 'UG');
  const prefix = national.slice(0, 2);
  if (['76', '77', '78', '39'].includes(prefix)) return 'MTN';
  if (['70', '74', '75', '20'].includes(prefix)) return 'AIRTEL';
  return undefined;
}
