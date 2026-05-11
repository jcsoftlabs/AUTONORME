"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHTG = formatHTG;
exports.formatUSD = formatUSD;
exports.formatHaitianDate = formatHaitianDate;
exports.formatHaitianDateTime = formatHaitianDateTime;
exports.formatHaitianPhone = formatHaitianPhone;
exports.isValidHaitianPhone = isValidHaitianPhone;
exports.isValidVIN = isValidVIN;
function formatHTG(amount, style = 'symbol') {
    const formatted = new Intl.NumberFormat('fr-HT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
    return style === 'symbol' ? `G ${formatted}` : `${formatted} HTG`;
}
function formatUSD(amountUsd, exchangeRate) {
    const usdFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amountUsd);
    if (exchangeRate) {
        const htgEquivalent = formatHTG(amountUsd * exchangeRate);
        return `${usdFormatted} (≈ ${htgEquivalent})`;
    }
    return usdFormatted;
}
function formatHaitianDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-HT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Port-au-Prince',
    }).format(d);
}
function formatHaitianDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-HT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Port-au-Prince',
    }).format(d);
}
function formatHaitianPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('509') && digits.length === 11) {
        return `+509 ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 8) {
        return `+509 ${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    return phone;
}
function isValidHaitianPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return ((digits.startsWith('509') && digits.length === 11) || digits.length === 8);
}
function isValidVIN(vin) {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return vinRegex.test(vin.trim());
}
//# sourceMappingURL=format.js.map