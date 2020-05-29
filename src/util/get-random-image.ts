import getImageList from './get-image-list';

export default function getRandomImage(): string {
    const images = getImageList();

    return images.images[Math.floor(Math.random() * images.images.length)];
}
