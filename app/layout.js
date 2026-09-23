import "./globals.css";

export const metadata = {
  title: "Rapsometeddy Business OS",
  description: "Simple business management for small businesses and solo entrepreneurs."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
