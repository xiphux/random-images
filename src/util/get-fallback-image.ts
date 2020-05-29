import getImageList from './get-image-list';

export default function getFallbackImage(): string {
    const images = getImageList();

    return images.fallback || '';
}
