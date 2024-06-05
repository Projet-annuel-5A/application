import AuthButton from '@/components/auth/AuthButton'
import BackButton from '@/components/nav/back';

export default function Header() {
    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-2">
                <div className="flex items-center">
                    <BackButton/>
                </div>
                <div className="flex justify-end items-center">
                    <AuthButton />
                </div>
            </div>
        </div>
    );
}
