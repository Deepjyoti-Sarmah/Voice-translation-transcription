import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'

interface FileDisplayProps {
    file: any;
    audioStream: any;
    handleAudioReset: () => any;
    handleFormSubmission: () => any;
}

const FileDisplay = ({handleFormSubmission, file, audioStream, handleAudioReset}: FileDisplayProps) => {

    const audioRef: any = useRef();

    useEffect(() => {
        if (!file && !audioStream) return
        if (file) {
            console.log("Here File", file)
            audioRef.current.src = URL.createObjectURL(file)
        } else {
            console.log("Here Audio", audioStream)
            audioRef.current.src = URL.createObjectURL(audioStream)
        }
    }, [audioStream, file]);

    return (
        <main 
            className="flex-1 p-4 flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center text-center pb-10 w-72 sm:w-96 max-w-full mx-auto">
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'> Your 
                <span className='text-blue-500 bold'> File </span>
            </h1>
            <div className='flex flex-col text-left my-4 '>
                <h3 className='font-semibold'>Name</h3>
                <p className='truncate'>{file ? file?.name: "custom audio"}</p>
            </div>

            <div className='flex flex-col mb-2'>
                <audio ref={audioRef} className='w-full controls'>
                    Your browser does not support the audio element.
                </audio>
            </div>

            <div className='flex items-center justify-between gap-4'>
                <Button
                    onClick={handleAudioReset}
                    variant="outline"
                    className='hover:text-blue-600 duration-200'
                >
                    Reset
                </Button>
                <Button 
                    onClick={handleFormSubmission}
                    variant="outline"
                    className='specialBtn flex items-center font-medium px-4 py-2 rounded-lg text-black hover:text-blue-600 gap-2'
                >
                    <p>Transcribe</p>
                    <TranscribeSVG />
                </Button>
            </div>
        </main>
    )
}

function TranscribeSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
    );
}

export default FileDisplay
