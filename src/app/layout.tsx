import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ModalProvider } from "@/components/ModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medigram",
  description: "Medical Patient Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>
          <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Navbar/>
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}