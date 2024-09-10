import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  endPoint: import.meta.env.MINIO_URL,
  port: 9000,
  useSSL: true,
  accessKey: 'nBMBri4fkNnjs0BdYNcF',
  secretKey: '4rNDbZOHxHVKsbIBA8KSIMlEPv8j9EIiUikNTIEv',
})