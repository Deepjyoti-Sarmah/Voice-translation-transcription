import React from 'react'
import { Button } from './ui/button'

const Homepage = () => {
    return (
        <main 
            className="flex-1 p-4 flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center text-center pb-10"
        >
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'> Free 
                <span className='text-blue-500 '>
                    Scribe
                </span>
            </h1>
            <h3 className='font-medium md:text-lg'> Record
                <span className='text-blue-500'> &rarr;</span> Transcribe
                <span className='text-blue-500'> &rarr;</span> Translate
            </h3>
            <Button
                variant="outline"
                className='flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl'>
                <p>Record</p>
                <RecordSVG />
            </Button>
            <p className='text-base'>Or 
                <label className='text-blue-500 cursor-pointer hover:text-blue-700 duration-200'> upload 
                    <input className='hidden' type='file' accept='.mp3,.wave'/>
                </label> a mp3 file
            </p>
            <p className='italic text-slate-500'>Free now free forever</p>
        </main>
    )
}

function RecordSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.4v3.3M8 22h8"/></svg>
    );
}

export default Homepage
