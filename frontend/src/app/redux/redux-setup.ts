// redux-persist.ts (Fixed Redux Store)
import { combineReducers, configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get } from "http";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";


export type Data = {
    token: string | null;
    userId : string | null
}

const initialState: Data = {
    token: null,
      userId : null

}

interface Storage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<string>;
    removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): Storage => {
    return {
        getItem(_key: string): Promise<string | null> {
            console.log(_key);
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string): Promise<string> {
            console.log(_key);
            return Promise.resolve(value);
        },
        removeItem(_key: string): Promise<void> {
            console.log(_key);
            return Promise.resolve();
        }
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const dataState = createSlice({
    name: "data",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUserId : (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        }

      
        
    }
});

export const { setToken , setUserId } = dataState.actions;

const rootReducer = combineReducers({
    data: dataState.reducer,
});

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["data"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store2 = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store2);

// Add these type exports (MISSING FROM YOUR ORIGINAL CODE)
export type RootState = ReturnType<typeof store2.getState>;
export type AppDispatch = typeof store2.dispatch;

