import type { FileAdapter } from './types.js';
import { localAdapter } from './local.js';
import { getS3Adapter } from './s3.js';

let adapter: FileAdapter | null = null;

export function getFileAdapter(): FileAdapter {
	if (!adapter) {
		adapter = process.env.S3_ENDPOINT ? getS3Adapter() : localAdapter;
	}
	return adapter;
}
