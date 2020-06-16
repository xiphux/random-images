# random-image

random-image is an [AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) function that redirects to a random image hosted on [AWS CloudFront](https://aws.amazon.com/cloudfront/) on each request, with additional options including referer whitelisting to prevent hotlinking. It comes with an [AWS CloudFormation](https://aws.amazon.com/cloudformation/) stack for deployment and is built using the [Serverless Application Framework](https://www.serverless.com/).

## Getting Started

Add any images you want to randomly choose from in the public/images directory. If you want to enable referer whitelisting, also include a fallback image in public/images to serve if the referer isn't on the whitelist.

In the AWS console, create a Route53 hosted zone for your root domain and a certificate in the us-east-1 region for the image domain if you don't have them already.

Edit serverless.yml, and configure the following options under the `custom` section:

```yaml
custom:
    domain: <the domain or subdomain to serve images from>
    rootDomain: <the root domain of the Route53 hosted zone>
    certificateArn: <the ARN of the HTTPS certificate to use for the CloudFront distribution>
    fallbackImage: <optional, the filename of the fallback image if a non-whitelisted referer is found>
    referers: <optional, a list of referer regex patterns>
```

For example:

```yaml
custom:
    domain: images.example.com
    rootDomain: example.com
    certificateArn: arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-0000-0000-000000000000
    fallbackImage: fallback.jpg
    referers:
        - 'https?:\/\/valid-referer.com'
        - 'https?:\/\/other-referer.com\/index\.php\?id=1234'
```

Install dependencies with `npm install` and [install and configure the serverless framework](https://www.serverless.com/framework/docs/getting-started/) and the [AWS CLI](https://aws.amazon.com/cli/) if you don't have them already. Deploy the serverless stack with the `serverless deploy` command, and the contents of the `public` folder to the S3 bucket with the `aws s3` command.

## Built With

* [serverless](https://www.serverless.com/)
* [TypeScript](https://www.typescriptlang.org/)

## Authors

* **Chris Han** - *Initial work* - [xiphux](https://github.com/xiphux)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details