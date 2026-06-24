import type { FileAdapter } from './types.js';

let s3Adapter: FileAdapter | null = null;

function getS3Client() {
	const { Client } = require('minio');
	return new Client({
		endPoint: process.env.S3_ENDPOINT!,
		accessKey: process.env.S3_ACCESS_KEY!,
		secretKey: process.env.S3_SECRET_KEY!,
		useSSL: true,
	});
}

function getS3Adapter(): FileAdapter {
	if (!s3Adapter) {
		const bucket = process.env.S3_BUCKET!;
		const publicUrl = process.env.S3_PUBLIC_URL || `https://${process.env.S3_ENDPOINT}/${bucket}`;
		const client = getS3Client();

		s3Adapter = {
			async upload(key: string, buffer: Buffer, contentType: string): Promise<string> {
				await client.putObject(bucket, key, buffer, { 'Content-Type': contentType });
				return `${publicUrl}/${key}`;
			},
			async delete(key: string): Promise<void> {
				await client.removeObject(bucket, key);
			},
		};
	}
	return s3Adapter;
}

export { getS3Adapter };
