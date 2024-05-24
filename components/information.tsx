import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import Transcription from './transcription';
import Translation from './translation';
import { finished } from 'stream';

const Information = ({output}: any) => {

    const [tab, setTab] = useState("transcription");
    const [translation, setTranslation] = useState(null);
    const [toLanguage, setToLanguage] = useState("Select language");
    const [translating, setTranslating] = useState(false)
    console.log(output);

    const worker: any = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(
                new URL("../utils/translate.worker.ts", import.meta.url), 
                {
                    type: "module",
                }
            )
        }

        const onMessageReceived = async (e: any) => {
            switch (e.data.status) {
                case "initiate":
                    console.log("DOWNLOADING")
                    break
                case "progress": 
                    console.log("LOADING")
                    break
                case  "update":
                    setTranslation(e.data.output);
                    console.log(e.data.output);
                    break
                case "complete":
                    setTranslating(false);
                    console.log("DONE");
                    break
            }
        }

        worker.current.addEventListener("message", onMessageReceived)

        return () => {
            worker.current.removeEventListener("message", onMessageReceived)
        }
    },[]);

    const textElement = 
        tab === "transcription" 
            ? output.map((val: any) => val.text) : translation ?? ""

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement("a");
        const file = new Blob([textElement], {type: "text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = `Freescribe_${new Date().toString()}.txt`;
        document.body.appendChild(element);
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage === "Select language") {
            return
        }
        setTranslating(true)

        worker.current.postMessage({
            text: output.map((val: any) => val.text),
            src_lang: "eng_Latn",
            tgt_lang: toLanguage
        })
    }

    return (
        <main 
            className="flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto">
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'> Your 
                <span className='text-blue-500 bold'> Transcription </span>
            </h1>
            <div className='grid grid-cols-2 sm:mx-auto bg-white  rounded-lg overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300 gap-2'>
                <Button 
                    onClick={() => setTab("transcription")}
                    variant="outline"
                    className={'px-4 rounded duration-200 py-1 ' + 
                        (tab === 'transcription' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600')}
                >Transcription</Button>
                <Button 
                    onClick={() => setTab("translation")}
                    variant="outline"
                    className={'px-4 rounded duration-200 py-1  ' + 
                        (tab === 'translation' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600')}
                >Translation</Button>
            </div>
            <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
                {(!finished || translating) && (
                    <div className='grid place-items-center'>
                        loading...
                    </div>
                )}
                {tab === "transcription" ? (
                    <Transcription textElement={textElement} / >
                ): (
                        <Translation />
                    )}

            </div>
        </main>
    )
}

export default Information
