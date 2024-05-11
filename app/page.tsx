
export default function Home() {
    return (
        <div className="flex flex-col p-4 max-w-[1000px] mx-auto w-full ">
            <section className="min-h-screen flex flex-col">
                <header className="flex items-center justify-between gap-4">
                    <h1> Free 
                        <span className="text-blue-400">Scribe</span>
                    </h1>
                    <button className="flex items-center gap-2">
                        <p>New</p>
                    </button>
                </header>
                <main className="flex-1"></main>
            </section>
            <h1 className="text-green-500">Free Scribe</h1>
            <footer></footer>
        </div>
    );
}

