"use client"
import FileDisplay from "@/components/fileDisplay";
import Header from "@/components/header";
import Homepage from "@/components/homepage";
import Information from "@/components/information";
import Transcribing from "@/components/transcribing";
import React, { useEffect } from "react";

export default function Home() {

    const [file, setFile] = React.useState<File | null>(null);
    const [audioStream, setAudioStream] = React.useState<Blob | null>(null);
    const [output, setOutput] = React.useState(true);
    const [loading, setLoading] = React.useState(true);

    const isAudioAvailable = file || audioStream;

    function handleAudioReset() {
        setFile(null);
        setAudioStream(null);
    }

    useEffect(() => {
        console.log("audioStream",audioStream);
    }, [audioStream]);

    return (
        <div className="flex flex-col max-w-[1000px] mx-auto w-full ">
            <section className="min-h-screen flex flex-col">
                <Header />
                { output ? (
                    <Information />
                ): loading? (
                        <Transcribing />
                    ): isAudioAvailable? (
                            <FileDisplay file={file} audioStream={audioStream} handleAudioReset={handleAudioReset} />
                        ): (
                                <Homepage setFile={setFile} setAudioStream={setAudioStream} />
                            ) }
            </section>
            <footer></footer>
        </div>
    );
}

