
import FileUploadButton from "./upload_button"
import TriggerTrainning from './trigger_training';

export default function Page() {
    const folders = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];
    return (
        <div className='flex flex-col gap-y-5 w-2/3 justify-center items-center bg-slate-500 p-5 rounded-md shadow-2xl'>
            <h1 className="font-extrabold text-4xl">MLOPS Page</h1>
            {folders.map((folder) => (
                <FileUploadButton key={folder} folderName={folder} />
            ))}
            <TriggerTrainning />
        </div>
    );
}


