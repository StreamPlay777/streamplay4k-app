<?php
/**
 * The pricing engine, server side.
 *
 * ⚠️ THIS IS A MIRROR OF src/data/pricing.ts. The two must agree exactly, and
 * this copy is the one that decides what a customer is charged. The browser's
 * total is never trusted — it arrives in the payload, it is compared against
 * what this file computes, and a mismatch is recorded and overridden. Anyone
 * can edit a number in their own browser before pressing submit; without this
 * check they would be quoting their own price.
 *
 * When the TERMS in pricing.ts change, change them here in the same commit.
 */

declare(strict_types=1);

const TERMS = [
    '3m'  => ['id' => '3m',  'months' => 3,  'label' => '3 Months',  'baseCents' => 3999],
    '6m'  => ['id' => '6m',  'months' => 6,  'label' => '6 Months',  'baseCents' => 6999],
    '12m' => ['id' => '12m', 'months' => 12, 'label' => '12 Months', 'baseCents' => 9999],
];

const EXTRA_DEVICE_RATE = 0.5;
const MAX_DEVICES = 5;
const MIN_DEVICES = 1;

/**
 * Authoritative quote. Same arithmetic and the same rounding order as quote()
 * in pricing.ts — extras are rounded once, then added, which is not the same
 * as rounding the sum.
 *
 * @return array{term: array, devices: int, baseCents: int, extraDevicesCents: int, totalCents: int, perMonthCents: int}
 */
function sp_quote(string $termId, int $devices): array
{
    $term = TERMS[$termId] ?? TERMS['12m'];
    $n = max(MIN_DEVICES, min(MAX_DEVICES, $devices));

    $extra = (int) round($term['baseCents'] * EXTRA_DEVICE_RATE * ($n - 1));
    $total = $term['baseCents'] + $extra;

    return [
        'term'              => $term,
        'devices'           => $n,
        'baseCents'         => $term['baseCents'],
        'extraDevicesCents' => $extra,
        'totalCents'        => $total,
        'perMonthCents'     => (int) round($total / $term['months']),
    ];
}

/** 9999 -> "$99.99". Matches money() in pricing.ts. */
function sp_money(int $cents): string
{
    return '$' . number_format($cents / 100, 2);
}
