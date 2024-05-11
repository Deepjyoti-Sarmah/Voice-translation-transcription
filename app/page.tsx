import Header from "@/components/header";
import Homepage from "@/components/homepage";

export default function Home() {
    return (
        <div className="flex flex-col max-w-[1000px] mx-auto w-full ">
            <section className="min-h-screen flex flex-col">
                <Header />
                {(<Homepage />)}
            </section>
            <h1 className="text-green-500">Free Scribe</h1>
            <footer></footer>
        </div>
    );
}


