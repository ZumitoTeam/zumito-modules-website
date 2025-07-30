import { json } from '@sveltejs/kit';
import { minioClient } from '$lib/minio';
import { v4 as uuidv4 } from 'uuid';

        const bucketName = 'zumito-modules';

        // Check if bucket exists, create if not
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1'); // Specify a region, e.g., 'us-east-1'
            console.log(`Bucket '${bucketName}' created successfully.`);
        }

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        let file: File | null = null;

        const iconEntries = formData.getAll('icon');
        const imageEntries = formData.getAll('images');

        // Find the actual File object for 'icon'
        for (const entry of iconEntries) {
            if (entry instanceof File) {
                file = entry;
                break;
            }
        }

        // If no icon file, check for 'images'
        if (!file) {
            for (const entry of imageEntries) {
                if (entry instanceof File) {
                    file = entry;
                    break;
                }
            }
        }

        if (!file || typeof file === 'string') {
            return json({ error: 'No valid file uploaded' }, { status: 400 });
        }

        if (!file.name) {
            return json({ error: 'Uploaded file has no name' }, { status: 400 });
        }

        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `images/${fileName}`;

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        await minioClient.putObject(bucketName, filePath, fileBuffer, file.size, { 'Content-Type': file.type });

        const fileUrl = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/${filePath}`;

        return new Response(fileUrl, { status: 200 });
    } catch (error) {
        console.error('Error uploading file to MinIO:', error);
        return json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    try {
        const fileUrl = await request.text();
        const url = new URL(fileUrl);
        const filePath = url.pathname.substring(url.pathname.indexOf(bucketName) + bucketName.length + 1);

        await minioClient.removeObject(bucketName, filePath);

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Error deleting file from MinIO:', error);
        return json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
