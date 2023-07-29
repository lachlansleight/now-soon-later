import { ReactNode } from "react";
import Head from "next/head";
import packageJson from "../../package.json";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>Now / Soon / Later</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen bg-neutral-800 text-white w-screen">
                <div className="h-8 bg-neutral-900 flex justify-center items-center text-xl italic shadow-md">
                    Now Soon Later{" "}
                    <span className="text-xs relative top-1 left-2 text-white text-opacity-50">
                        v{packageJson.version}
                    </span>
                </div>
                <div className="px-2 mt-2">{children}</div>
            </main>
        </>
    );
};

export default Layout;
