import { RenNetwork } from "@renproject/utils";
import { RootState } from "src/store/rootReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NetworkState = {
  network: RenNetwork;
};

const initialNetwork = RenNetwork.Testnet;

let initialState: NetworkState = {
  network: initialNetwork as unknown as RenNetwork,
};

const slice = createSlice({
  name: "network",
  initialState,
  reducers: {
    //@ts-ignore
    setNetwork(state, action: PayloadAction<RenNetwork>) {
      state.network = action.payload;
    },
  },
});

export const { setNetwork } = slice.actions;

export const networkReducer = slice.reducer;

export const $network = (state: RootState) => state.network;
