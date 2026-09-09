<?php
/**
 * Input validation.
 *
 * Mirrors src/lib/validation.ts so a submission the browser accepted is not
 * then rejected here for a different reason — that would look like a broken
 * form to someone who typed everything correctly.
 */

declare(strict_types=1);

/** Digits after stripping punctuation; 8–15 is the E.164 range in practice. */
function sp_valid_phone(string $raw): bool
{
    $digits = preg_replace('/\D+/', '', $raw);
    $len = strlen((string) $digits);
    return $len >= 8 && $len <= 15;
}

function sp_valid_email(string $raw): bool
{
    return (bool) filter_var($raw, FILTER_VALIDATE_EMAIL);
}

/** Trim, drop control characters, cap length. Everything from the wire. */
function sp_clean(mixed $v, int $max = 200): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}

/**
 * Campaign context, flattened to one readable line.
 *
 * The browser sends an object of optional UTM fields (see readCampaign() in
 * src/lib/orderService.ts). It is attacker-controlled — it comes straight off
 * the query string — so every value is cleaned and the whole thing is capped.
 * Empty fields are dropped so the internal email shows "—" rather than five
 * blank labels.
 */
function sp_campaign(mixed $v): string
{
    if (!is_array($v)) return '';
    $keys = ['campaignId', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    $parts = [];
    foreach ($keys as $k) {
        $val = sp_clean($v[$k] ?? '', 60);
        if ($val !== '') $parts[] = $k . '=' . $val;
    }
    return mb_substr(implode(' · ', $parts), 0, 240);
}
