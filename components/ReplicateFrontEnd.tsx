import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { inter, maven } from '@/fonts'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ReplicateFrontEnd() {
    const [prediction, setPrediction] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: (e.target as any).prompt.value,
            }),
        });
        let newPrediction = await response.json();
        if (response.status !== 201) {
            setError(newPrediction.detail);
            return;
        }
        setPrediction(newPrediction);

        while (
            newPrediction.status !== "succeeded" &&
            newPrediction.status !== "failed"
        ) {
            await sleep(1000);
            const response = await fetch("/api/predictions/" + newPrediction.id);
            newPrediction = await response.json();
            if (response.status !== 200) {
                setError(newPrediction.detail);
                return;
            }
            console.log({ newPrediction });
            setPrediction(newPrediction);
        }
    };

    return (
    <>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>
      <div className="w-11/12 h-11/12 p-10 flex bg-brandGray-200/20 rounded-lg justify-between">
        <div className="w-2/5 h-full flex flex-col gap-8">
          <p
            className={`text-3xl font-semibold text-white ${inter.className}`}
          >
            Dream something with{" "}
            <a href="https://replicate.com/stability-ai/stable-diffusion">
              SDXL
            </a>
            :
          </p>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              placeholder="Enter a prompt to display an image"
              className="w-full p-3 rounded-md"
              rows={3}
            />
            <button
              type="submit"
              className="w-full bg-primary p-3 rounded-md"
            >
              Go!
            </button>
          </form>

          {error && <div>{error}</div>}
        </div>
        <div className="h-full w-1/2 flex justify-center items-center">
          {prediction && (
            <div className="w-full flex flex-col justify-evenly items-center">
              {prediction.output && (
                <div className="w-10/12 aspect-square relative flex justify-center items-center">
                  <Image
                    layout="fill"
                    src={
                      prediction.output[prediction.output.length - 1]
                    }
                    alt="output"
                    className="w-full h-full"
                  />
                </div>
              )}
              <p className="text-white text-md">status: {prediction.status}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}