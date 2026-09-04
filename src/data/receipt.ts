/**
 * The cost-comparison receipt — the sales argument of the whole site.
 *
 * PLACEHOLDER BASKET — six typical US services at published list prices,
 * September 2026. Figures are illustrative and need a refresh before launch.
 * The live Primo sites run the same device at $193.45 / "save $2,256 a year".
 */

export interface LineItem {
  code: string;
  /** Chip colour, sampled from each service's brand mark. */
  chip: string;
  name: string;
  price: number;
}

export const basket: LineItem[] = [
  { code: 'LT', chip: '#C4302B', name: 'Live TV base plan', price: 82.99 },
  { code: 'SP', chip: '#1B3A6B', name: 'Season sports pass', price: 48.99 },
  { code: 'MV', chip: '#B01030', name: 'Film service standard', price: 19.99 },
  { code: 'PR', chip: '#4A2A7A', name: 'Premium add-on', price: 16.99 },
  { code: 'KF', chip: '#12628E', name: 'Kids & family tier', price: 13.99 },
  { code: 'ND', chip: '#2F6B4F', name: 'News + documentaries', price: 10.49 },
];

export const basketMonthly = basket.reduce((sum, l) => sum + l.price, 0); // 193.44
export const basketYearly = basketMonthly * 12;

/** Six services billed monthly = 72 separate card payments a year. */
export const paymentsPerYear = basket.length * 12;

export const receiptMeta = {
  customer: 'CUST 8842',
  date: '09.04.26 00:52',
  card: '•••• 4471',
  barcodeRef: '4011 2026 8842 9',
};

export const smallPrint =
  'Comparison based on published US list prices for six typical services, September 2026. Figures are illustrative.';
