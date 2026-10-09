import "./globals.css";

export const metadata = {
  title: "Rapsometeddy Business OS",
  description: "Simple business management for small businesses and solo entrepreneurs.",
  icons: { icon: "/crowned-r.svg" },
  themeColor: "#09070f"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
