import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset, Chain } from "@renproject/chains";
import { RootState } from "src/store/rootReducer";

export type AssetBalance = {
  symbol: Asset;
  balance: number;
};

export type AddressScreening = {
  dialogOpened: boolean;
  fromAddressSanctioned: boolean | null;
  toAddressSanctioned: boolean | null;
};

type WalletState = {
  chain: Chain;
  pickerOpened: boolean;
  balances: Array<AssetBalance>;
  screening: AddressScreening;
};

let initialState: WalletState = {
  chain: Chain.Ethereum,
  pickerOpened: false,
  balances: [],
  screening: {
    dialogOpened: false,
    fromAddressSanctioned: null,
    toAddressSanctioned: null,
  },
};

const slice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    //@ts-ignore
    setChain(state, action: PayloadAction<any>) {
      state.chain = action.payload;
    },
    //@ts-ignore
    setPickerOpened(state, action: PayloadAction<boolean>) {
      state.pickerOpened = action.payload;
    },
    //@ts-ignore
    addOrUpdateBalance(state, action: PayloadAction<AssetBalance>) {
      const index = state.balances.findIndex((entry: any) => entry.symbol === action.payload.symbol);
      if (index > -1) {
        state.balances[index] = action.payload;
      } else {
        state.balances.push(action.payload);
      }
    },
    //@ts-ignore
    resetBalances(state) {
      state.balances = [];
    },
    //@ts-ignore
    setScreeningWarningOpened(state, action: PayloadAction<boolean>) {
      state.screening.dialogOpened = action.payload;
    },
    //@ts-ignore
    setFromAddressSanctioned(state, action: PayloadAction<boolean | null>) {
      state.screening.fromAddressSanctioned = action.payload;
    },
    //@ts-ignore
    setToAddressSanctioned(state, action: PayloadAction<boolean | null>) {
      state.screening.toAddressSanctioned = action.payload;
    },
  },
});

export const {
  setChain,
  setPickerOpened,
  addOrUpdateBalance,
  resetBalances,
  setScreeningWarningOpened,
  setFromAddressSanctioned,
  setToAddressSanctioned,
} = slice.actions;

export const walletReducer = slice.reducer;

export const $wallet = (state: RootState) => state.wallet;

export const $screening = createSelector($wallet, (wallet: any) => wallet.screening);
