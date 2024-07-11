import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';

const storage = new Storage({
    projectId: "annual-project-427112",
    credentials: {
        "client_id": "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com",
        "client_secret": process.env.NEXT_GCP_SECRET,
        "quota_project_id": "annual-project-427112",
        "refresh_token": process.env.NEXT_GCP_TOKEN,
        "type": "authorized_user",
        "universe_domain": "googleapis.com"
    }
});

const bucketName = 'interviewz-training-data';
const bucket = storage.bucket(bucketName);

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

async function fileExists(filePath: string) {
    const [exists] = await bucket.file(filePath).exists();
    return exists;
}

async function generateUniqueFileName(filePath: string): Promise<string> {
    const ext = filePath.substring(filePath.lastIndexOf('.'));
    const base = filePath.substring(0, filePath.lastIndexOf('.'));

    let newFilePath = filePath;
    let counter = 1;

    while (await fileExists(newFilePath)) {
        newFilePath = `${base}_${counter}${ext}`;
        counter++;
    }

    return newFilePath;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const folderName = formData.get('folderName') as string;
        const files = formData.getAll('files') as File[];

        if (!files.length || !folderName) {
            return NextResponse.json({ message: 'No files or folder name provided' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            let filePath = `train/${folderName}/${file.name}`;
            filePath = await generateUniqueFileName(filePath);

            const blob = bucket.file(filePath);
            const buffer = Buffer.from(await file.arrayBuffer());
            const stream = blob.createWriteStream({
                resumable: false,
            });

            return new Promise<void>((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
                stream.end(buffer);
            });
        });

        await Promise.all(uploadPromises);

        return NextResponse.json({ message: 'Files uploaded successfully' }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
