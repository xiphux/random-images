import { CloudFrontRequestHandler } from 'aws-lambda';
import redirect from '../util/redirect';
import getFallbackImage from '../util/get-fallback-image';
import getRandomImage from '../util/get-random-image';
import refererMatch from '../util/referer-match';

export const handler: CloudFrontRequestHandler = async (event) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;

    if (!uri.endsWith('/')) {
        return request;
    }

    let referer = '';
    if (request.headers && request.headers['referer'] && request.headers['referer'].length) {
        referer = request.headers['referer'][0].value;
    }

    if (!referer || !refererMatch(referer)) {
        const fallback = getFallbackImage();
        if (fallback) {
            return redirect(fallback);
        }
    }

    return redirect(getRandomImage());
};
