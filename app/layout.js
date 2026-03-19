import "./globals.css";

export const metadata = {
  title: "Lexle",
  description: "A daily word-guessing game — guess the five-letter word in six tries",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lexle",
  },
  openGraph: {
    title: "Lexle",
    description: "A daily word-guessing game — guess the five-letter word in six tries",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#4ade80",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
