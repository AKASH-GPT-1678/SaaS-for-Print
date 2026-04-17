// app/hooks.ts
"use client";

import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import { RootState , AppDispatch } from "@/app/redux/redux-setup";

// typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;