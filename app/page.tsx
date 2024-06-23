import AuthButton from "../components/auth/AuthButton";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from 'next/image';
import logo from '@/public/images/logo.png'

export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (user) {
    return redirect("/application/sessions/");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <div className="w-4/5 h-4/5 flex flex-col justify-center bg-slate-500 rounded-md p-2 shadow-md">
        <h1 className="text-white text-center align-middle font-extrabold">
          Welcome to Interviewz !
        </h1>
        <br />
        <span className="text-white text-center align-middle">
          Interviewz is an online tool powered by A.I to help you analyse your job interviews has an HR
        </span>
        <div className="flex justify-center my-5">
          <Image src={logo} alt="logo" width={200} height={200}/>
        </div>
      </div>
    </div>
  );
}
