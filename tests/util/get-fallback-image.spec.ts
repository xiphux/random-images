import getFallbackImage from '../../src/util/get-fallback-image';
import getImageList from '../../src/util/get-image-list';

jest.mock('../../src/util/get-image-list');

describe('getFallbackImage', () => {

    beforeEach(() => {
        (getImageList as jest.Mock).mockReset();
    });

    it('returns fallback image', () => {
        (getImageList as jest.Mock).mockReturnValue({
            images: ['random1.gif', 'random2.gif', 'random3.gif'],
            fallback: 'fallback.jpg',
        });
        expect(getFallbackImage()).toEqual('fallback.jpg');
        expect(getImageList).toHaveBeenCalled();
    });

    it('returns blank if fallback image is not provided', () => {
        (getImageList as jest.Mock).mockReturnValue({
            images: ['random1.gif', 'random2.gif', 'random3.gif'],
        });
        expect(getFallbackImage()).toEqual('');
        expect(getImageList).toHaveBeenCalled();
    });

});
