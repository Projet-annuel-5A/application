
import { Storage } from '@google-cloud/storage';
import FileUploadButton from "./upload_button"
import TriggerTrainning from './trigger_training';

export default function Page() {



    const folders = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];


    return (
        <div className='flex flex-col gap-y-5 w-full justify-start'>
            {folders.map((folder) => (
                <FileUploadButton key={folder} folderName={folder} />
            ))}
            <TriggerTrainning />
        </div>
    );
}


