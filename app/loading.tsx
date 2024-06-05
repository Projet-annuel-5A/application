import Image from 'next/image';
import loadingGIF from '@/icons/gif/loading.gif';

export default function LoadingComponent() {
    return (
        <div className="flex justify-center w-full h-full">
            <div className="flex flex-col justify-center w-full h-full">
                <Image src={loadingGIF} alt="loading" />
            </div>
        </div>
    );
}
