import { Inter_Tight, Poppins, Roboto_Condensed } from "next/font/google";
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const condensed = Roboto_Condensed({ subsets: ["latin"], variable: "--font-roboto-condensed", weight: ["400", "700"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["800", "900"], display: "swap" });
export default function CityLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${condensed.variable} ${poppins.variable}`}>{children}</div>;
}
