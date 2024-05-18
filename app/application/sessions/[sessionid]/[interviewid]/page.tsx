import { createClient } from "@/utils/supabase/server";
import { Session, Interview } from "@/app/types/database";
import ScreenRecorder from '@/components/record/ScreenRecorder'

interface ParamsInterface {
    sessionid: Session["id"],
    interviewid: Interview["id"]
}

export default async function InterviewPage({ params }: { params: ParamsInterface }) {

    const supabase = createClient();

    const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .filter('id', 'eq', params.interviewid)

    if (error) {
        console.log(error);
    }


    if (data) {
        const interview: Interview = data[0];
        console.log(interview);
        if (!interview.raw_file_ok) {
            return (
                <div className="flex justify-center">
                    <div className="flex flex-col justify-center">
                        <ScreenRecorder sessionID={params.sessionid} interviewID={params.interviewid} />
                    </div>
                </div>
            );
        } else {
            if (!interview.video_ok || !interview.text_ok || !interview.diarization_ok) {
                return (
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-center">
                            In processing ...
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-center">
                            {params.interviewid}
                        </div>
                    </div>
                );
            }
        }
    }


}