import getRandomImage from '../../src/util/get-random-image';
import getImageList from '../../src/util/get-image-list';

jest.mock('../../src/util/get-image-list');

describe('getRandomImage', () => {

    let oldRandom: any;

    beforeEach(() => {
        (getImageList as jest.Mock).mockReturnValue({
            images: ['random1.gif', 'random2.gif', 'random3.gif'],
            fallback: 'fallback.jpg',
        });
        oldRandom = Math.random;
    });

    afterEach(() => {
        Math.random = oldRandom;
    });

    it('returns random image', () => {
        Math.random = jest.fn().mockReturnValue(0);
        expect(getRandomImage()).toEqual('random1.gif');

        Math.random = jest.fn().mockReturnValue(0.4);
        expect(getRandomImage()).toEqual('random2.gif');

        Math.random = jest.fn().mockReturnValue(0.99);
        expect(getRandomImage()).toEqual('random3.gif');

        expect(getImageList).toHaveBeenCalled();
    });

});
