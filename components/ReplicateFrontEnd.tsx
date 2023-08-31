import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { inter, maven } from "@/fonts";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ABI from "../crosschain-nft/ABI.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const contractAddress = "0x5dc9b53fc9d83fd233ae77591998b7db26cc9542";

export default function ReplicateFrontEnd() {
  const { address, isConnected } = useAccount();
  const [prediction, setPrediction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("Hello");
  const [desc, setDesc] = useState<string>("I am awesome");
  const [height, setHeight] = useState<string>("512");
  const [width, setWidth] = useState<string>("512");
  const [file, setFile] = useState<File>();

  const [metadata, setMetadata] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName((e.target as any).name.value);
    setDesc((e.target as any).prompt.value);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: (e.target as any).name.value,
        prompt: (e.target as any).prompt.value,
        negative_prompt: (e.target as any).negative_prompt.value,
        height: parseInt((e.target as any).height.value),
        width: parseInt((e.target as any).width.value),
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

  const handleMint = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const blob = (await fetch()).blob();
    // const url = await uploading(blob);
    // console.log(blob);
    e.preventDefault();
    console.log(prediction.output[prediction.output.length - 1]);
    var data = JSON.stringify({
      name: name,
      description: desc,
      image: prediction.output[prediction.output.length - 1],
    });
    console.log(data);
    const metaData = await uploading(data);
    setMetadata(metaData);
    console.log(metaData);

    await writeAsync2?.().then((res) => {
      console.log(
        "You can check the transaction here: https://testnet.axelarscan.io/gmp/" +
          res.hash
      );
    });
  };

  const handleCrossChainMint = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    console.log(prediction.output[prediction.output.length - 1]);
    var data = JSON.stringify({
      name: name,
      description: desc,
      image: prediction.output[prediction.output.length - 1],
    });
    console.log(data);
    const metaData = await uploading(data);
    setMetadata(metaData);
    console.log(metaData);

    await writeAsync2?.().then((res) => {
      console.log(res);

      console.log(
        "You can check the transaction here: https://testnet.axelarscan.io/gmp/" +
          res.hash
      );
    });
  };

  const uploading = async (e: any) => {
    console.log(e);
    // setLoading(2);
    const storage = new ThirdwebStorage({
      clientId: "bb55d02f9ac9150c4ddfdf1a927217ff",
    });
    const url = await storage.upload(e);
    console.log(url);
    // setLoading(0);
    return url;
  };

  const prepareSafeMintContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMint",
    args: [address, metadata],
  });

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(
    prepareSafeMintContractWrite.config
  );

  const preparesafeMintFromOtherChainContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMintFromOtherChain",
    args: [
      "Polygon", // chain name  // Avalanche // Fantom
      "0x5dc9b53fc9d83fd233ae77591998b7db26cc9542",
      address,
      metadata,
    ],
  });

  const {
    data: data2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    writeAsync: writeAsync2,
  } = useContractWrite(preparesafeMintFromOtherChainContractWrite.config);

  return (
    <>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>
      <div className="w-11/12 h-11/12 p-10 flex bg-brandGray-200/20 rounded-lg justify-between">
        <div className="w-2/5 h-full flex flex-col gap-8">
          <div
            className={`text-3xl font-semibold text-white ${inter.className}`}
          >
            Dream something with OpenJourney:
          </div>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name of your awesome NFT"
              className="w-full p-3 rounded-md"
            />
            <textarea
              name="prompt"
              placeholder="Enter a prompt to display an image"
              className="w-full p-3 rounded-md"
              rows={3}
            />
            <input
              type="text"
              name="negative_prompt"
              placeholder="Specify things to not see in the output"
              className="w-full p-3 rounded-md"
            />
            <label
              htmlFor="height"
              title="Select Image Height:"
              className="hidden"
            >
              Select Image Height:
            </label>
            <select
              id="height"
              name="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-3 rounded-md"
            >
              <option value="128">128</option>
              <option value="256">256</option>
              <option value="512" selected>
                512
              </option>
              {/* <option value="1024">1024</option> */}
            </select>
            <label
              htmlFor="width"
              title="Select Image width:"
              className="hidden"
            >
              Select Image Height:
            </label>
            <select
              id="width"
              name="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-3 rounded-md"
            >
              <option value="128">128</option>
              <option value="256">256</option>
              <option value="512" selected>
                512
              </option>
              <option value="1024">1024</option>
            </select>
            <div className="w-full flex flex-row gap-1 justify-between">
              <button type="submit" className="w-1/2 bg-primary p-3 rounded-md">
                Go!
              </button>
              <button
                type="button"
                onClick={handleMint}
                className="w-1/2 bg-primary p-3 rounded-md"
              >
                Mint NFT
              </button>
            </div>
          </form>

          {error && <div>{error}</div>}
        </div>
        <div className="h-full w-1/2 flex flex-col justify-evenly items-center">
          {prediction && (
            <div className="relative w-full max-w-screen-xl h-[70vh] max-h-[60vh] flex flex-col gap-1 justify-evenly items-center">
              {prediction.output && (
                <div className="w-full h-full overflow-y-auto">
                  <Image
                    layout="fill"
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="text-white text-md font-mono font-bold">
                status: {prediction.status}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
