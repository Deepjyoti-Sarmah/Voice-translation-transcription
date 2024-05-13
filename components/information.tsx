import React, { useState } from 'react'
import { Button } from './ui/button'

const Information = () => {

    const [tab, setTab] = useState("transcription");

    return (
        <main 
            className="flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto">
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'> Your 
                <span className='text-blue-500 bold'> Transcription </span>
            </h1>
            <div className='grid grid-cols-2 sm:mx-auto bg-white  rounded-lg overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300 gap-2'>
                <Button 
                    variant="outline"
                    className={'px-4 rounded duration-200 py-1 ' + (tab === 'transcription' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600')}
                    onClick={() => setTab("transcription")}
                >Transcription</Button>
                <Button 
                    variant="outline"
                    className={'px-4 rounded duration-200 py-1  ' + (tab === 'translation' ? ' bg-blue-400 text-white' : ' text-blue-500 hover:text-blue-600')}
                    onClick={() => setTab("translation")}
                >Translation</Button>

            </div>
        </main>
    )
}

export default Information
