import { NextRequest, NextResponse } from 'next/server';
import { JobServiceClient } from '@google-cloud/aiplatform';

const client = new JobServiceClient({
    projectId: "annual-project-427112",
    credentials: {
        "client_id": "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com",
        "client_secret": process.env.NEXT_GCP_SECRET,
        "quota_project_id": "annual-project-427112",
        "refresh_token": process.env.NEXT_GCP_TOKEN,
        "type": "authorized_user",
        "universe_domain": "googleapis.com"
    },
    apiEndpoint: 'europe-west1-aiplatform.googleapis.com'
});

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export async function POST(req: NextRequest) {
    try {
        const project = 'annual-project-427112';
        const location = 'europe-west1';
        const customJobDisplayName = 'yolo training';
        const containerImageUri = 'gcr.io/annual-project-427112/train:latest';
        const parent = `projects/${project}/locations/${location}`;

        const customJob = {
            displayName: customJobDisplayName,
            jobSpec: {
                workerPoolSpecs: [
                    {
                        machineSpec: {
                            machineType: 'n1-standard-8',
                        },
                        replicaCount: 1,
                        containerSpec: {
                            imageUri: containerImageUri,
                        },
                    },
                ],
            },
        };

        console.log("Training job triggering received");

        const createRequest = { parent, customJob };
        const [createResponse] = await client.createCustomJob(createRequest);

        console.log('Create custom job response:\n', JSON.stringify(createResponse));

        return NextResponse.json({ message: 'Training job successfully created' }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create training job', error: error.message }, { status: 500 });
    }
}
