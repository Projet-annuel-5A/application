import SideBar from "@/components/nav/SideBar";

export default function AppLayout({children}){
    return (
        <div className="w-full h-full flex justify-center align-middle px-2">
            <SideBar/>
            <div className="flex justify-center align-middle w-full">
                {children}
            </div>
            
        </div>
    );
}