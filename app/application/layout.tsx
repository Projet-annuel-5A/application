import React from "react";
import Header from "@/components/header/header";

export default function AppLayout({ children }:{ children: React.ReactNode }){
    return (
        <div className="w-full h-full flex justify-center align-middle px-2">
            <div className="flex flex-col w-full h-full">
                    <Header/>
                    <div className="flex justify-center align-middle w-full h-full p-2">
                        {children}
                    </div>
            </div>
        </div>
    );
}