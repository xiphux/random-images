import getReferers from './get-referers';

export default function refererMatch(referer: string): boolean {
    if (!referer) {
        return false;
    }

    const referers = getReferers();
    if (!referers.length) {
        return true;
    }

    const normalizedReferer = decodeURI(referer.replace(/\+/g, ' '))

    return referers.some((regex) => RegExp(regex, 'i').test(normalizedReferer));
}