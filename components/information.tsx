import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import Transcription from './transcription';
import Translation from './translation';

const Information = ({output, finished}: any) => {

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

        return () => worker.current.removeEventListener("message", onMessageReceived)
        
    },[]);

    const textElement = tab === "transcription" ? output.map((val: any) => val.text) : translation ?? ""

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement("a");
        const file = new Blob([textElement], {type: "text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = `Freescribe_${new Date().toString()}.txt`;
        document.body.appendChild(element);
        element.click();
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
        <main className="flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto">
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
                Your <span className="text-blue-500 bold">Transcription</span>
            </h1>

            <div className="grid grid-cols-2 sm:mx-auto bg-white rounded-lg overflow-hidden items-center p-2 blueShadow border-[2px] border-solid border-blue-300 gap-2">
                <Button
                    onClick={() => setTab("transcription")}
                    variant="outline"
                    className={
                        "px-4 rounded duration-200 py-1 " +
                            (tab === "transcription"
                                ? " bg-blue-500 text-white"
                                : " text-blue-400 hover:text-blue-600")
                    }
                >
                    Transcription
                </Button>
                <Button
                    onClick={() => setTab("translation")}
                    variant="outline"
                    className={
                        "px-4 rounded duration-200 py-1  " +
                            (tab === "translation"
                                ? " bg-blue-500 text-white"
                                : " text-blue-400 hover:text-blue-600")
                    }
                >
                    Translation
                </Button>
            </div>
            <div className="my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4">
                {(!finished || translating) && (
                    <div className="grid place-items-center">
                        <LoadingSpinnerSVG />
                    </div>
                )}
                {tab === "transcription" ? (
                    <Transcription textElement={textElement} />
                ) : (
                        <Translation
                            toLanguage={toLanguage}
                            translating={translating}
                            textElement={textElement}
                            setTranslating={setTranslating}
                            setTranslation={setTranslation}
                            setToLanguage={setToLanguage}
                            generateTranslation={generateTranslation}
                        />
                    )}
            </div>
            <div className="flex items-center gap-4 mx-auto">
                <Button
                    onClick={handleCopy}
                    variant="outline"
                    title="Copy"
                    className="bg-white  hover:text-blue-600 duration-200 text-blue-400 px-2 aspect-square grid place-items-center rounded"
                >
                    <CopySVG />
                </Button>
                <Button
                    onClick={handleDownload}
                    variant="outline"
                    title="Download"
                    className="bg-white  hover:text-blue-600 duration-200 text-blue-400 px-2 aspect-square grid place-items-center rounded"
                >
                    <DownloadSVG />
                </Button>
            </div>
        </main>
    )
}

function LoadingSpinnerSVG() {
    return (
        <svg 
            // fill="white" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" 
                opacity=".25"
            />
            <path 
                d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" 
                className="spinner_ajPY"
            /></svg>
    )
}

function CopySVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
    )
}

function DownloadSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
    )
}

export default Information

        {/* <main  */}
        {/*     className="flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto"> */}
        {/*     <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'> Your  */}
        {/*         <span className='text-blue-500 bold'> Transcription </span> */}
        {/*     </h1> */}
        {/*     <div className='grid grid-cols-2 sm:mx-auto bg-white  rounded-lg overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300 gap-2'> */}
        {/*         <Button  */}
        {/*             onClick={() => setTab("transcription")} */}
        {/*             variant="outline" */}
        {/*             className={ */}
        {/*                 'px-4 rounded duration-200 py-1 ' +  */}
        {/*                 (tab === 'transcription' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600') */}
        {/*             } */}
        {/*         > */}
        {/*             Transcription */}
        {/*         </Button> */}
        {/*         <Button  */}
        {/*             onClick={() => setTab("translation")} */}
        {/*             variant="outline" */}
        {/*             className={ */}
        {/*                 'px-4 rounded duration-200 py-1  ' +  */}
        {/*                 (tab === 'translation' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600') */}
        {/*             } */}
        {/*         > */}
        {/*             Translation */}
        {/*         </Button> */}
        {/*     </div> */}
        {/*     <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'> */}
        {/*         {(!finished || translating) && ( */}
        {/*             <div className='grid place-items-center'>  */}
        {/*                 <LoadingSpinnerSVG /> */}
        {/*             </div> */}
        {/*         )} */}
        {/*         {tab === "transcription" ? ( */}
        {/*             <Transcription textElement={textElement} / > */}
        {/*         ): ( */}
        {/*                 <Translation */}
        {/*                     toLanguage={toLanguage} */}
        {/*                     translating={translating} */}
        {/*                     textElement={textElement} */}
        {/*                     setTranslating={setTranslating} */}
        {/*                     setTranslation={setTranslation} */}
        {/*                     setToLanguage={setToLanguage} */}
        {/*                     generateTranslation={generateTranslation} */}
        {/*                 /> */}
        {/*             )} */}
        {/*     </div> */}
        {/*     <div className='flex items-center gap-4 mx-auto'> */}
        {/*         <Button */}
        {/*             onClick={handleCopy} */}
        {/*             variant="outline" */}
        {/*             title='copy' */}
        {/*             className='bg-white hover:text-blue-500 duration-200 px-2 aspect-square grid place-items-center rounded' */}
        {/*         > */}
        {/*             <CopySVG/> */}
        {/*         </Button> */}
        {/*         <Button  */}
        {/*             onClick={handleDownload} */}
        {/*             variant="outline" */}
        {/*             title='download' */}
        {/*             className='bg-white hover:text-blue-500 duration-200 px-2 aspect-square grid place-items-center rounded' */}
        {/*         > */}
        {/*             <DownloadSVG/> */}
        {/*         </Button> */}
        {/*     </div> */}
        {/* </main> */}
