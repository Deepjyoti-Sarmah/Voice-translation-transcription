import React from 'react'
import { Button } from '../components/ui/button';

const Header = () => {
    return (
        <header className="flex items-center justify-between gap-4 p-4">
            <a href="/">
                <h1 className='font-bold'> Record
                    <span className="text-blue-500 bold">Scribe</span>
                </h1>
            </a>

            <a href="/">
                <Button
                    variant="outline"
                    className="flex text-black text-sm items-center gap-2 px-4 py-2 rounded-lg specialBtn hover:text-blue-600 duration-200">
                    <p>New</p>
                    <PlusSVG />
                </Button>
            </a>
        </header>
    )
};

function PlusSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    );
}

export default Header
