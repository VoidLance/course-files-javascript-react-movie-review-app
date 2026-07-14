import { type AppType } from "next/app";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "~/context/ThemeContext";

import "~/styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
    <ThemeProvider>
      <div className={montserrat.className}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
    </>
  );
};

export default MyApp;
