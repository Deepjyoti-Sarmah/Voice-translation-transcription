import { LANGUAGES } from '@/utils/presets'
import React from 'react'
import { Button } from './ui/button'

const Translation = ({textElement, toLanguage, translating, setToLanguage, generateTranslation}: any) => {
    return (
        <>
            {textElement && !translating && <p>{textElement}</p>}
            {!translating && (
                <div className='flex flex-col gap-1 mb-4'>
                    <p className='text-xs sm:text-sm font-medium text-slate-500 mr-auto'>
                        To language
                    </p>
                    <div className='flex items-stretch gap-2 sm:gap-4'>
                        <select
                            value={toLanguage}
                            className='flex-1 outline-none w-full focus:outline-none bg-white duration-200 p-2 rounded'
                            onChange={(e) => setToLanguage(e.target.value)}
                        >
                            <option value={"Select language"}>Select language</option>
                            { Object.entries(LANGUAGES).map(([key, value]) => {
                                return (
                                    <option key={key} value={value}>{key}</option>
                                )
                            })
                            }
                        </select>
                        <Button
                            onClick={generateTranslation}
                            variant="outline"
                            className='specialBtn px-3 py-2 rounded-lg hover:text-blue-600 duration-200'
                        >Translate</Button>
                    </div>
                </div>
            )}
        </>
    )
}

// হয়তো তেওঁ পাৰ্টীখনলৈ উভতি আহি তেওঁক লৈ গ'ল আৰু শেষত তেওঁৰ হৃদয়েও অব্যাহত ৰাখিলে।

export default Translation
