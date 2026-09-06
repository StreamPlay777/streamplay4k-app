/**
 * LOCKED pricing. Prices must not change without an explicit instruction.
 *
 * Device rule (confirmed): a base price covers ONE device. Devices 2–5 each
 * add 50% of that plan's ORIGINAL BASE PRICE — not 50% of a per-month figure
 * and not compounded.
 */
const CURRENCY = { code: "USD", symbol: "$" };

/** Devices covered by the base price of every plan. Confirmed: one. */
const INCLUDED_DEVICES = 1;

/** Hard ceiling on simultaneous devices for any plan. */
const MAX_DEVICES = 5;

/** Multiplier applied to the base plan price for each extra device. */
const ADDITIONAL_DEVICE_RATE = 0.5;

const money = (n) => Number(n.toFixed(2));

const basePlans = [
  { id: "3-months", name: "3 Months", months: 3, price: 39.99 },
  { id: "6-months", name: "6 Months", months: 6, price: 69.99 },
  { id: "12-months", name: "12 Months", months: 12, price: 99.99, highlight: true }
];

const plans = basePlans.map((plan) => {
  const additionalDevicePrice = money(plan.price * ADDITIONAL_DEVICE_RATE);
  return {
    ...plan,
    highlight: plan.highlight === true,
    currency: CURRENCY.code,
    priceFormatted: `${CURRENCY.symbol}${plan.price.toFixed(2)}`,
    pricePerMonth: money(plan.price / plan.months),
    pricePerMonthFormatted: `${CURRENCY.symbol}${money(plan.price / plan.months).toFixed(2)}`,
    includedDevices: INCLUDED_DEVICES,
    maxDevices: MAX_DEVICES,
    additionalDevicePrice,
    additionalDevicePriceFormatted: `${CURRENCY.symbol}${additionalDevicePrice.toFixed(2)}`,
    /** Total for a given device count, capped at MAX_DEVICES. */
    priceForDevices(devices = INCLUDED_DEVICES) {
      const count = Math.min(Math.max(devices, INCLUDED_DEVICES), MAX_DEVICES);
      return money(plan.price + (count - INCLUDED_DEVICES) * additionalDevicePrice);
    }
  };
});

export default {
  currency: CURRENCY,
  includedDevices: INCLUDED_DEVICES,
  maxDevices: MAX_DEVICES,
  additionalDeviceRate: ADDITIONAL_DEVICE_RATE,
  plans,
  defaultPlanId: "12-months",
  /** Convenience lookup for templates: pricing.byId["6-months"] */
  byId: Object.fromEntries(plans.map((p) => [p.id, p]))
};
