import { createClient } from '@/utils/supabase/server';
import { Session, Interview } from "@/app/types/database";

interface ParamsInterface {
    sessionid: Session["id"],
    interviewid: Interview["id"]
}

export default async function Page({ params }: { params: ParamsInterface }) {
    const supabase = createClient();
    const { data } = await supabase.from("interviews").select("*").filter("id", "eq", params.interviewid);

    if (data) {
        const Interview = data[0] as Interview;
        const { data: pdfData } = supabase.storage.from('agreement_files').getPublicUrl(`pdfs/${Interview.agreement_doc_id}.pdf`);
        return (
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                            <div className="text-gray-600 font-medium">Last Name</div>
                            <div className="text-gray-800 text-lg">{Interview.last_name}</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                            <div className="text-gray-600 font-medium">First Name</div>
                            <div className="text-gray-800 text-lg">{Interview.first_name}</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                            <div className="text-gray-600 font-medium">Email</div>
                            <div className="text-gray-800 text-lg">{Interview.email}</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                            <div className="text-gray-600 font-medium">Phone</div>
                            <div className="text-gray-800 text-lg">{Interview.phone}</div>
                        </div>
                    </div>
                {pdfData && (
                    <iframe src={pdfData.publicUrl} className="w-full h-full" />
                )}
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-xl font-semibold text-gray-800">No data available</h1>
                </div>
            </div>
        );
    }
}
