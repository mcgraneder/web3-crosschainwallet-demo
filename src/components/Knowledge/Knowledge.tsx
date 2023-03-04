import Image from "next/image";
import { AppWrap } from "@/wrapper";
import style from "./Knowledge.module.scss";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useMultiwallet } from "../../connectors/multiwallet/MultiwalletProvider";
import { useWallet } from "../../features/wallet/walletHooks";
import { $network } from "src/features/network/networkSlice";
import { $wallet, setPickerOpened } from "src/features/wallet/walletSlice";
import { Chain } from "@renproject/chains";
import { WalletPickerProps } from "../WalletModal/WalletConnectionModal";
import { getMultiwalletConfig } from "../../connectors/multiwallet/multiwalletConfig";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ConnectorConfig } from "../../connectors/multiwallet/index";
import { getWalletConfig } from "../../connectors/multiwallet/walletsConfig";
import Wallet from "../../connectors/multiwallet/Wallet";
import { getLibrary, getJsonRPCProvider } from "../../utils/misc";
import { ethers } from "ethers";
import AppDescription from "../AppDescription/AppDescription";
import Step2 from "../AppDescription/Step";

const abouts = [
  {
    icon: "Metamask",
    title: "Metamask",
    Network: "Mainnet",
    chainId: "chainId",
    account: "account",
    balance: "balance",
    blockNumber: "blocknumber",
  },
];

type CommonTypes = "step1" | "step2"
export type Flow = CommonTypes 

const Knowledge = () => {
  const { enabledChains, } = useMultiwallet<any, any>();

  const { chain } = useSelector($wallet);
  const multiwallet = useWallet(Chain.Ethereum);
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [chainID, setChainID] = useState<any>("");
  const [blockNumber, setBlockNumber] = useState<any>("");

    const [walleBinancetBalance, setBinanceWalletBalance] = useState<string>("");
    const [binancechainID, setBinanceChainID] = useState<any>("");
    const [binanceblockNumber, setBinanceBlockNumber] = useState<any>("");

        const [walleSolanaBalance, setSolanaWalletBalance] = useState<string>("0.0");
        const [solanachainID, setsolanaChainID] = useState<any>("?");
        const [solanablockNumber, setsolanaBlockNumber] = useState<any>("163,694,407");
  const [provider, setProvider] = useState<any>(null);
  const [binanceProvider, setBinanceProvider] = useState<any>(null);

  const [flow, setFlow] = useState<Array<Flow>>(["step1"]);
  const [Connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    const wallets = Object.values(enabledChains);
    let isConnected = [];
    wallets.forEach((wallet) => {
      if (wallet.status !== "connected") isConnected.push(false)
    })
    if (isConnected.length == wallets.length) setConnected(false)
    else setConnected(true)
  }, [enabledChains])

    const pushFlow = (nf: Flow) => setFlow((f) => [...f, nf]);
    const popFlow = () =>
      setFlow((f) => {
        const fl = [...f];
        fl.pop();
        return fl;
      });
  // console.log(network, chain)

  const {

    account,
    connected,
    provider: lib,

  } = multiwallet;

  function signMessageEth() {
    const msg = "Hallo Welt";
    const signer = provider.getSigner(account!)
    let signature = signer.signMessage(msg).then((res: any) => console.log(res));
    console.log(signature);
  }

    function signMessageBin() {
      const msg = "Hallo Welt";
      const signer = binanceProvider.getSigner(account!);
      let signature = signer.signMessage(msg).then((res: any) => console.log(res));
      console.log(signature);
    }

  useEffect(() => {
    console.log(lib);
    if (lib && enabledChains[Chain.Ethereum]?.status === "connected") {
      const prov = getLibrary(enabledChains[Chain.Ethereum]?.provider);
      let stale = false
      setProvider(prov);
      prov.getBalance(account).then((result: any) => {
        console.log(result);
        setWalletBalance(ethers.utils.formatEther(result));
      });
      prov.getNetwork().then((result: any) => {
        setChainID(result);
      });
      const updateBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };
      prov.on("block", updateBlockNumber);

      return () => {
        prov.removeListener("block", updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };

    }
  }, [connected, chain, lib, account, enabledChains]);

  useEffect(() => {
    console.log(lib);
    if (lib && enabledChains[Chain.BinanceSmartChain]?.status === "connected") {
      const prov = getLibrary(enabledChains[Chain.BinanceSmartChain]?.provider);
      let stale = false;
      setBinanceProvider(prov);
      prov.getBalance(account).then((result: any) => {
        console.log(result);
        setBinanceWalletBalance(ethers.utils.formatEther(result));
      });
      prov.getNetwork().then((result: any) => {
        setBinanceChainID(result);
      });
      const updateBlockNumber = (blockNumber: any) => {
        setBinanceBlockNumber(blockNumber);
      };
      prov.on("block", updateBlockNumber);

      return () => {
        prov.removeListener("block", updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };
    }
  }, [connected, chain, lib, account, enabledChains]);

  const wallets = Object.values(enabledChains);

  const activeFlowState = flow[flow.length - 1];
  

  if (wallets.length == 0 || !Connected) return (
    <>
      {activeFlowState === "step1" && <AppDescription onBack={pushFlow} />}
      {activeFlowState === "step2" && <Step2 onBack={popFlow} />}
    </>
  );
  
  else return (
    <>
      { <h2 className='text-4xl font-bold text-primary'>Current Connections</h2>}

      <div className={style["app__profiles"]}>
        {wallets?.map((wallet) => {
          const walletConfig = getWalletConfig(wallet.name as any);
          const { Icon } = walletConfig;

          if (wallet.status !== "connected") return(
            <>
            
            </>
          )
          else return (
            <>
              {wallet.chain !== "Solana" ? (
                <motion.div
                  whileInView={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1, type: "spring" }}
                  className={`cursor-pointer ${style["app__profile-item"]}`}
                  key={wallet.name}>
                  <p className='p-text'>{wallet.name}</p>
                  {wallet.account && (
                    <div className='justify-centerw-[150px] my-4 flex h-[150px] items-center rounded-full bg-grey-500 p-4'>
                      <Icon width={120} height={120} />
                    </div>
                  )}
                  <div className='w-full rounded-xl border border-grey-500 px-4 py-2'>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Account:</span>
                      <span className='text-primary'>{`${wallet.account.substring(
                        0,
                        6
                      )}...${wallet.account.substring(
                        wallet.account.length - 7,
                        wallet.account.length
                      )}`}</span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Network:</span>
                      <span className='text-primary'>
                        {wallet.name === "BinanceSmartChain" ? binancechainID.name : chainID.name}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>ChainID:</span>
                      <span className='text-primary'>
                        {wallet.name === "BinanceSmartChain"
                          ? binancechainID.chainId
                          : chainID.chainId}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Balance:</span>
                      <span className='text-primary'>
                        {wallet.name === "BinanceSmartChain" ? walleBinancetBalance : walletBalance}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>BlockNumber:</span>
                      <span className='text-primary'>
                        {wallet.name === "BinanceSmartChain" ? binanceblockNumber : blockNumber}
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={wallet.name === "BinanceSmartChain" ? signMessageBin : signMessageEth}
                    className='mt-6 flex w-full items-center justify-center rounded-3xl border border-primary p-2 hover:cursor-pointer'>
                    <div className='text-sm font-semibold text-primary hover:text-primary'>
                      {"Sign Message"}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  whileInView={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1, type: "spring" }}
                  className={`cursor-pointer ${style["app__profile-item"]}`}
                  key={wallet.name}>
                  <p className='p-text'>{wallet.name}</p>
                  {wallet.account && (
                    <div className='justify-centerw-[150px] my-4 flex h-[150px] items-center rounded-full bg-grey-500 p-4'>
                      <Icon width={120} height={120} />
                    </div>
                  )}
                  <div className='w-full rounded-xl border border-grey-500 px-4 py-2'>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Account:</span>
                      <span className='text-primary'>{`${wallet.account?.substring(
                        0,
                        6
                      )}...${wallet.account?.substring(
                        wallet.account.length - 7,
                        wallet.account.length
                      )}`}</span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Network:</span>
                      <span className='text-primary'>
                        {wallet.chain}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>ChainID:</span>
                      <span className='text-primary'>
                        {solanachainID}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>Balance:</span>
                      <span className='text-primary'>
                        {walleSolanaBalance}
                      </span>
                    </div>
                    <div className='my-2 flex items-center justify-between'>
                      <span>BlockNumber:</span>
                      <span className='text-primary'>
                        {solanablockNumber}
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => {}}
                    className='mt-6 flex w-full items-center justify-center rounded-3xl border border-primary p-2 hover:cursor-pointer'>
                    <div className='text-sm font-semibold text-primary hover:text-primary'>
                      {"Sign Message"}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default Knowledge;
