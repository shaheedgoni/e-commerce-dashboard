"use client";

import { createContext } from "react";

export const TitleContext = createContext<{
  title: string;
  setTitle: (title: string) => void;
}>({ title: "", setTitle: () => {} });
