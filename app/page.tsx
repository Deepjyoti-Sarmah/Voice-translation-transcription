"use client"
import FileDisplay from "@/components/fileDisplay";
import Header from "@/components/header";
import Homepage from "@/components/homepage";
import Information from "@/components/information";
import Transcribing from "@/components/transcribing";
import { MessageTypes } from "@/utils/presets";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {

    const [file, setFile] = useState<File | null>(null);
    const [audioStream, setAudioStream] = useState<Blob | null>(null);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const [finished, setFinished] = useState(false);
    const [_downloading, setDownloading] = useState(false);

    const isAudioAvailable = file || audioStream;

    function handleAudioReset() {
        setFile(null);
        setAudioStream(null);
    }

    const worker:any = useRef(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(
                new URL("../utils/whisper.worker.ts", import.meta.url), 
                {
                    type: "module"
                }
            );
        }

        const onMessageReceived = async (e: any) => {
            switch (e.data.type) {
                case "DOWNLOADING":
                    setDownloading(true);
                    console.log("DOWNLOADING");
                    break;
                case "LOADING":
                    setLoading(true);
                    console.log("LOADING");
                    break;
                case "RESULT":
                    setOutput(e.data.results)
                    console.log(e.data.results)
                    break;
                case "INFERENCE_DONE":
                    setFinished(true);
                    console.log("DONE");
                    break;
            }
        }

        worker.current.addEventListener("message", onMessageReceived);

        return () => { 
            worker.current.removeEventListener("message", onMessageReceived); 
        }
    },[]);

    async function readAudioFrom(file:any) {
        const samplingRate = 16000;
        const audioContext = new AudioContext({sampleRate: samplingRate});
        const response = await file.arrayBuffer()
        const decoded = await audioContext.decodeAudioData(response);
        const audio = decoded.getChannelData(0);
        return audio;
    }

    async function handleFormSubmission() {
        if (!file && !audioStream) return;

        let audio = await readAudioFrom(file ? file : audioStream)
        const model_name = `openai/whisper-tiny.en`

        worker.current?.postMessage({
            type: MessageTypes.INFERENCE_REQUEST,
            audio,
            model_name
        })
    }

    return (
        <div className="flex flex-col max-w-[1000px] mx-auto w-full ">
            <section className="min-h-screen flex flex-col">
                <Header />
                { output ? (
                    <Information output={output}/>
                ): loading ? (
                        <Transcribing />
                    ): isAudioAvailable ? (
                            <FileDisplay 
                                handleFormSubmission={handleFormSubmission} 
                                file={file} 
                                audioStream={audioStream} 
                                handleAudioReset={handleAudioReset} 
                            />
                        ): (
                                <Homepage setFile={setFile} setAudioStream={setAudioStream} />
                            ) }
            </section>
            <footer></footer>
        </div>
    );
}

