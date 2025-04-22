//import css file 
import './globals.scss'
import './tokens.css'
// Import slick css files
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { Barlow  } from 'next/font/google'
// import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter"
import ClientProvider from '@/Providers/ClientProvider';
import Script from 'next/script'

// fonts settings

const fonts = Barlow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
  weight: ['300', '400', '500',  '600', '700', '800'], 
  preload: true
})


export default function RootLayout({ children }) {
  const GTM_ID = 'GTM-ada'

  return (
    <html lang="en" >
 <Script
          id="gtm-script"
          strategy="lazyOnload" // or "lazyOnload" if you prefer
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s);j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `
          }}
        />
              <body className={`${fonts.variable}`}>
                  {/* 3) GTM noscript fallback */}
          <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} 
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
            loading='lazy'
          />
        </noscript>
        {/* <AppRouterCacheProvider> */}
      <ClientProvider>
          {children}
        </ClientProvider>
        {/* </AppRouterCacheProvider> */}
      </body>
    </html>
  )
}