import { walletReducer } from "src/features/wallet/walletSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { networkReducer } from "src/features/network/networkSlice";

const rootReducer = combineReducers({
  network: networkReducer,
  wallet: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
