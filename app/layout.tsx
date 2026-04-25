// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"AI Automation Suite · Tryvor",description:"Plataforma IA para PYMES", manifest:"/manifest.json"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="es"><body>{children}</body></html>);}
