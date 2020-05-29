import redirect from '../../src/util/redirect';

describe('redirect', () => {

    it('does a temporary redirect to an image', () => {
        expect(redirect('test.gif')).toEqual({
            status: '302',
            headers: {
                location: [{
                    key: 'Location',
                    value: `/images/test.gif`
                }],
                'cache-control': [{
                    key: 'Cache-control',
                    value: 'no-cache, no-store, must-revalidate',
                }],
                'pragma': [{
                    key: 'Pragma',
                    value: 'no-cache',
                }],
                'expires': [{
                    key: 'Expires',
                    value: '0',
                }],
            }
        })
    });

});
