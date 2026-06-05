import { InvalidPayloadError } from './errors.js';

const REMOTE_URL_PATTERN = /^https?:\/\//i;
const DEFAULT_MAX_REMOTE_CONFIG_URLS = 5;
const DEFAULT_MAX_REMOTE_CONFIG_URL_LENGTH = 2048;

export function validateRemoteConfigInput(config, options = {}) {
    const urls = extractRemoteConfigUrls(config);
    const maxUrls = options.maxRemoteConfigUrls ?? DEFAULT_MAX_REMOTE_CONFIG_URLS;
    if (urls.length > maxUrls) {
        throw new InvalidPayloadError(`Too many remote subscription sources; maximum is ${maxUrls}`);
    }

    for (const url of urls) {
        validateRemoteSubscriptionUrl(url, options);
    }
}

export function extractRemoteConfigUrls(config) {
    return String(config || '')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => REMOTE_URL_PATTERN.test(line));
}

export function validateRemoteSubscriptionUrl(rawUrl, options = {}) {
    const maxLength = options.maxRemoteConfigUrlLength ?? DEFAULT_MAX_REMOTE_CONFIG_URL_LENGTH;
    if (String(rawUrl).length > maxLength) {
        throw new InvalidPayloadError(`Remote subscription source is too long; maximum is ${maxLength} characters`);
    }

    let url;
    try {
        url = new URL(rawUrl);
    } catch {
        throw new InvalidPayloadError('Remote subscription source is not a valid URL');
    }

    if (url.protocol !== 'https:') {
        throw new InvalidPayloadError('Remote subscription source must use HTTPS');
    }

    if (!isAllowedRemoteHost(url.hostname)) {
        throw new InvalidPayloadError('Remote subscription source host is not allowed');
    }

    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    if (pathname !== '/sub') {
        throw new InvalidPayloadError('Remote subscription source path must be /sub');
    }

    if (!String(url.searchParams.get('token') || '').trim()) {
        throw new InvalidPayloadError('Remote subscription source must include a token parameter');
    }
}

function isAllowedRemoteHost(hostname) {
    const host = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
    if (!host || host === 'localhost' || host.endsWith('.localhost')) {
        return false;
    }
    if (isIPv4Literal(host) || isIPv6Literal(host)) {
        return false;
    }
    return true;
}

function isIPv4Literal(hostname) {
    const parts = hostname.split('.');
    return parts.length === 4 && parts.every(part => {
        if (!/^\d+$/.test(part)) return false;
        const value = Number(part);
        return value >= 0 && value <= 255;
    });
}

function isIPv6Literal(hostname) {
    return hostname.includes(':');
}
