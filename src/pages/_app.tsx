import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toast.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { MultiwalletProvider } from "src/connectors/multiwallet";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import { Provider } from "react-redux";
import store from "src/store/store";

const toastConfig = {
  autoClose: 6000,
  closeButton: true,
  closeOnClick: false,
  theme: "dark",
  draggable: false,
  pauseOnHover: true,
  progressStyle: { visibility: "visible", animationDirection: "reverse" },
} as ToastContainerProps;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Web3 CrossChain Wallet Demo</title>
      </Head>
      <MultiwalletProvider>
        <Provider store={store}>
          <ToastContainer {...toastConfig} />
          <Component {...pageProps} />
        </Provider>
      </MultiwalletProvider>
    </>
  );
}

export default MyApp;
