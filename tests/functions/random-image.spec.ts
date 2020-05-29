import { handler } from '../../src/functions/random-image';
import getRandomImage from '../../src/util/get-random-image';
import getFallbackImage from '../../src/util/get-fallback-image';
import getReferers from '../../src/util/get-referers';

jest.mock('../../src/util/get-random-image');
jest.mock('../../src/util/get-fallback-image');
jest.mock('../../src/util/get-referers');

describe('random-image', () => {

    beforeEach(() => {
        (getRandomImage as jest.Mock).mockReset();
        (getFallbackImage as jest.Mock).mockReset();
        (getReferers as jest.Mock).mockReset();
    });

    it('won\'t redirect a request to non-root', async () => {
        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/images/test.gif'
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual({
            uri: 'https://images.example.com/images/test.gif'
        });
    });

    it('redirects to fallback without a referer', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);
        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/'
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/fallback.jpg'
                    })
                ])
            })
        }));
    });

    it('redirects to random image without a referer if fallback isn\'t defined', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);
        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/'
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/random1.gif'
                    })
                ])
            })
        }));
    });

    it('redirects to random image with a referer if no referer matches are defined', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue([]);

        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/',
                            headers: {
                                referer: [
                                    {
                                        key: 'Referer',
                                        value: 'https://invalid-referer.com'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/random1.gif'
                    })
                ])
            })
        }));
    });

    it('redirects to random image without a referer match if fallback isn\'t defined', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);

        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/',
                            headers: {
                                referer: [
                                    {
                                        key: 'Referer',
                                        value: 'https://invalid-referer.com'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/random1.gif'
                    })
                ])
            })
        }));
    });

    it('redirects to fallback image without a referer match if fallback is defined', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);

        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/',
                            headers: {
                                referer: [
                                    {
                                        key: 'Referer',
                                        value: 'https://invalid-referer.com'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/fallback.jpg'
                    })
                ])
            })
        }));
    });

    it('redirects to random image with referer match', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);

        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/',
                            headers: {
                                referer: [
                                    {
                                        key: 'Referer',
                                        value: 'https://valid-referer.com'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
            headers: expect.objectContaining({
                location: expect.arrayContaining([
                    expect.objectContaining({
                        value: '/images/random1.gif'
                    })
                ])
            })
        }));
    });

    it('handlers referer patterns', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue([
            'https?:\\/\\/test(\\.example\\.com)?\\/profile.php\\?id=9876',
            'https?:\\/\\/test(\\.example\\.com)?\\/profile.php\\?username=chan',
            'https?:\\/\\/test(\\.example\\.com)?\\/profile.php\\?name=Chris Han'
        ]);

        const passing = [
            'https://test/profile.php?id=9876',
            'https://test.example.com/profile.php?id=9876',
            'https://test/profile.php?username=chan',
            'https://test.example.com/profile.php?username=chan',
            'https://test/profile.php?name=Chris Han',
            'https://test.example.com/profile.php?name=Chris Han',
            'https://test/profile.php?name=Chris%20Han',
            'https://test.example.com/profile.php?name=Chris%20Han',
            'https://test/profile.php?name=Chris+Han',
            'https://test.example.com/profile.php?name=Chris+Han',
            'https://test/profile.php?name=chris han',
            'https://test.example.com/profile.php?name=chris han',
            'https://test/profile.php?name=chris%20han',
            'https://test.example.com/profile.php?name=chris%20han',
            'https://test/profile.php?name=chris+han',
            'https://test.example.com/profile.php?name=chris+han',
        ];
        const failing = [
            'https://test/profile.php?id=1234',
            'https://test.example.com/profile.php?id=1234',
            'https://test/profile.php?username=jsmith',
            'https://test.example.com/profile.php?username=jsmith',
            'https://test/profile.php?name=John Smith',
            'https://test.example.com/profile.php?name=John Smith',
            'https://test/profile.php?name=John%20Smith',
            'https://test.example.com/profile.php?name=John%20Smith',
            'https://test/profile.php?name=John+Smith',
            'https://test.example.com/profile.php?name=John+Smith',
        ];

        for (const referer of passing) {
            expect(await handler({
                Records: [
                    {
                        cf: {
                            request: {
                                uri: 'https://images.example.com/',
                                headers: {
                                    referer: [
                                        {
                                            key: 'Referer',
                                            value: referer
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
                headers: expect.objectContaining({
                    location: expect.arrayContaining([
                        expect.objectContaining({
                            value: '/images/random1.gif'
                        })
                    ])
                })
            }));
        }

        for (const referer of failing) {
            expect(await handler({
                Records: [
                    {
                        cf: {
                            request: {
                                uri: 'https://images.example.com/',
                                headers: {
                                    referer: [
                                        {
                                            key: 'Referer',
                                            value: referer
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            } as any, undefined as any, undefined as any)).toEqual(expect.objectContaining({
                headers: expect.objectContaining({
                    location: expect.arrayContaining([
                        expect.objectContaining({
                            value: '/images/fallback.jpg'
                        })
                    ])
                })
            }));
        }
    });

    it('temporary redirects without caching', async () => {
        (getFallbackImage as jest.Mock).mockReturnValue('fallback.jpg');
        (getRandomImage as jest.Mock).mockReturnValue('random1.gif');
        (getReferers as jest.Mock).mockReturnValue(['https://valid-referer.com']);

        expect(await handler({
            Records: [
                {
                    cf: {
                        request: {
                            uri: 'https://images.example.com/',
                            headers: {
                                referer: [
                                    {
                                        key: 'Referer',
                                        value: 'https://valid-referer.com'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        } as any, undefined as any, undefined as any)).toEqual({
            status: '302',
            headers: {
                location: [{
                    key: 'Location',
                    value: `/images/random1.gif`
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
        });
    })

});
