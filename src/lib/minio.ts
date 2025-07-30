import * as Minio from 'minio';

import { PUBLIC_MINIO_URL } from '$env/static/public';
import { MINIO_ACCESS_KEY, MINIO_SECRET_KEY } from '$env/static/private';
const url = new URL(PUBLIC_MINIO_URL);

export const minioClient = new Minio.Client({
  endPoint: url.hostname,
  port: parseInt(url.port || (url.protocol === 'https:' ? '443' : '80')),
  useSSL: url.protocol === 'https:',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});