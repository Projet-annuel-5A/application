import { createClient } from "@/utils/supabase/server";
import { Session, Interview } from "@/app/types/database";
import ScreenRecorder from '@/components/record/ScreenRecorder';
import Results from "./results";

interface ParamsInterface {
    sessionid: Session["id"],
    interviewid: Interview["id"]
}

export default async function InterviewPage({ params }: { params: ParamsInterface }) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .filter('id', 'eq', params.interviewid);

    if (error) {
        console.log(error);
        return <div>Error fetching interview data</div>;
    }

    if (data) {
        const interview: Interview = data[0];

        if (!interview.raw_file_ok) {
            return (
                <div className="flex justify-center">
                    <div className="flex flex-col justify-center">
                        <ScreenRecorder sessionID={params.sessionid} interviewID={params.interviewid} />
                    </div>
                </div>
            );
        } else {
            return <Results sessionid={params.sessionid} interviewid={params.interviewid} interview={interview} />
        }
    } else {
        return <div>Interview not found</div>;
    }
}
