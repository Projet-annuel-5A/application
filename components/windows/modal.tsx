export default function Modal({ isOpen, close, children }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={close}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50 rounded-lg shadow-lg">
                {children}
            </div>
        </>
    );
}