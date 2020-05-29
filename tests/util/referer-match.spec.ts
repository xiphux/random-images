import refererMatch from '../../src/util/referer-match';
import getReferers from '../../src/util/get-referers';

jest.mock('../../src/util/get-referers');

describe('refererMatch', () => {

    beforeEach(() => {
        (getReferers as jest.Mock).mockReset();
    });

    it('rejects a blank referer', () => {
        expect(refererMatch('')).toEqual(false);
    });

    it('matches if no referers are defined', () => {
        (getReferers as jest.Mock).mockReturnValue([]);
        expect(refererMatch('https://example.com')).toEqual(true);
    });

    it('rejects if no referer patterns match', () => {
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?id=9876',
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?username=chan',
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?name=Chris Han',
        ]);
        expect(refererMatch(
            'https://test/profile.php?id=1234'
        )).toEqual(false);
        expect(refererMatch(
            'https://test.example.com/profile.php?id=1234'
        )).toEqual(false);
        expect(refererMatch(
            'https://test/profile.php?username=jsmith'
        )).toEqual(false);
        expect(refererMatch(
            'https://test.example.com/profile.php?username=jsmith'
        )).toEqual(false);
        expect(refererMatch(
            'https://test/profile.php?name=John Smith'
        )).toEqual(false);
        expect(refererMatch(
            'https://test.example.com/profile.php?name=John Smith'
        )).toEqual(false);
    });

    it('matches if any referer pattern matches', async () => {
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?id=9876',
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?username=chan',
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?name=Chris Han',
        ]);
        expect(refererMatch(
            'https://test/profile.php?id=9876'
        )).toEqual(true);
        expect(refererMatch(
            'https://test.example.com/profile.php?id=9876'
        )).toEqual(true);
        expect(refererMatch(
            'https://test/profile.php?username=chan'
        )).toEqual(true);
        expect(refererMatch(
            'https://test.example.com/profile.php?username=chan'
        )).toEqual(true);
        expect(refererMatch(
            'https://test/profile.php?name=Chris Han'
        )).toEqual(true);
        expect(refererMatch(
            'https://test.example.com/profile.php?name=Chris Han'
        )).toEqual(true);
    });

    it('decodes uris', () => {
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?name=Chris Han',
        ]);
        expect(refererMatch(
            'https://test/profile.php?name=Chris%20Han'
        )).toEqual(true);
        expect(refererMatch(
            'https://test.example.com/profile.php?name=Chris%20Han'
        )).toEqual(true);
    });

    it('decodes pluses', () => {
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?name=Chris Han',
        ]);
        expect(refererMatch(
            'https://test/profile.php?name=Chris+Han'
        )).toEqual(true);
        expect(refererMatch(
            'https://test.example.com/profile.php?name=Chris+Han'
        )).toEqual(true);
    });

    it('matches case insensitively', () => {
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\.example\.com)?\\/profile.php\\?name=Chris Han',
        ]);
        expect(refererMatch(
            'https://test/profile.php?name=chris+han'
        )).toEqual(true);
        expect(refererMatch(
            'https://test/profile.php?name=chris%20han'
        )).toEqual(true);
        expect(refererMatch(
            'https://test/profile.php?name=chris han'
        )).toEqual(true);
    });

});
