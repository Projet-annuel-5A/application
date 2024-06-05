export type User = {
    id: string
}


export type Session = {
    id?: string,
    created_at?: string,
    name: string,
    startDate: string,
    endDate: string,
    user_id?: User["id"]
};

export type Interview = {
    id?: string,
    created_at?: string,
    duration: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    session_id: Session["id"];
    user_id?: User["id"],
    agreement_ok:boolean,
    agreement_doc_id: string,
    raw_file_ok: boolean,
    diarization_ok: boolean,
    audio_ok: boolean,
    text_ok: boolean,
    video_ok: boolean
};

export type RowResult = {
    id: string,
    created_at: string,
    interview_id: Interview["id"],
    start: number,
    end: number,
    type: ResultType,
    prediction: any,
    user_id?: User["id"]
};

export type ResultType = "video" | "audio" | "text";