import { CloudFrontResultResponse } from "aws-lambda";

export default function redirect(image: string): CloudFrontResultResponse {
    return {
        status: '302',
        headers: {
            location: [{
                key: 'Location',
                value: `/images/${image}`
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
    };
}