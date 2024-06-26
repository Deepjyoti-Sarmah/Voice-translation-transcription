import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/button'

interface HomepageProps {
    setAudioStream: (stream: Blob | null) => void;
    setFile: (file: File | null) => void;
}

const Homepage = ({ setFile, setAudioStream }: HomepageProps) => {

    const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive");
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [duration, setDuration] = useState<number>(0);

    const mediaRecoder = useRef<MediaRecorder | null>(null);

    const mimeType = "audio/webm";

    async function startRecording() {
        let tempStream: MediaStream | undefined;
        // console.log(`Start Recording`);

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            tempStream = streamData;
        } catch (err: any) {
            // console.log(err.message);
            return;
        }
        setRecordingStatus("recording");

        //create new Media recorder instance using the stream
        const media = new MediaRecorder(tempStream, { mimeType })
        mediaRecoder.current = media;

        mediaRecoder.current.start();
        let localAudioChunks: Blob[] = [];
        mediaRecoder.current.ondataavailable = (event: BlobEvent) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    async function stopRecording() {
        setRecordingStatus("inactive");
        // console.log("Stop Recording");
        if (mediaRecoder.current) {
            mediaRecoder.current.stop();
            mediaRecoder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                setAudioStream(audioBlob);
                setAudioChunks([]);
                setDuration(0);
            }
        }
    };

    useEffect(() => {
        if (recordingStatus === "inactive") return;
        const interval = setInterval(() => {
            setDuration(curr => curr + 1);
        }, 1000);
        return () => clearInterval(interval);
    })

    return (
        <main
            className="flex-1 p-4 flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center text-center pb-10"
        >
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'> Record
                <span className='text-blue-500 bold'>
                    Scribe
                </span>
            </h1>
            <h3 className='font-medium md:text-lg'> Record
                <span className='text-blue-500'> &rarr;</span> Transcribe
                <span className='text-blue-500'> &rarr;</span> Translate
            </h3>
            <Button
                variant="outline"
                className='flex text-black items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl hover:text-blue-600 duration-200'
                onClick={recordingStatus === "inactive" ? startRecording : stopRecording}
            >
                <p>{recordingStatus === "inactive" ? "Record" : "Stop Recording"}</p>
                <div className='flex items-center gap-2'>
                    {duration !== 0 && (
                        <p className='text-sm'>{duration}s</p>
                    )}
                    <RecordSVG recordingStatus={recordingStatus} />
                </div>
            </Button>
            <p className='text-base flex flex-row text-center items-center justify-center gap-2'>Or
                <label className='text-blue-500 cursor-pointer hover:text-blue-700 duration-200 flex flex-row gap-1'>
                    <span><FileSVG/></span>
                    upload
                    <input
                        className='hidden'
                        type='file'
                        accept='.mp3,.wave'
                        onChange={(e) => {
                            if (e.target.files) {
                                const tempFile = e.target.files[0]
                                setFile(tempFile);
                            }
                        }}
                    />
                </label> a mp3 file
            </p>
            <p className='italic text-slate-400'>A web based audio transcoder</p>
        </main>
    )
}

type RecordingStatus = "inactive" | "recording";

function RecordSVG({ recordingStatus }: { recordingStatus: RecordingStatus }) {
    const stockeColor = recordingStatus === "inactive" ? "#3b82f6" : "#f6423b"
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stockeColor}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.4v3.3M8 22h8" />
        </svg>
    );
}

function FileSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#609af7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"/><path d="M14 3v5h5M18 21v-6M15 18h6"/></svg>
    )
}

export default Homepage
