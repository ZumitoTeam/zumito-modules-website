import { writeFile, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { FileAdapter } from './types.js';

const uploadsDir = join(process.cwd(), 'static', 'uploads');

export const localAdapter: FileAdapter = {
	async upload(key: string, buffer: Buffer): Promise<string> {
		const filePath = join(uploadsDir, key);
		await mkdir(join(filePath, '..'), { recursive: true });
		await writeFile(filePath, buffer);
		return `/uploads/${key}`;
	},
	async delete(key: string): Promise<void> {
		const filePath = join(uploadsDir, key);
		await unlink(filePath).catch(() => {});
	},
};
