import { Inter } from "next/font/google";
import "./globals.css";
import ProviderNextUI from "@/Provider/ProviderNextUI";
import { RoleProvider } from "@/Provider/RoleContext";
import { RefetchProvider } from "@/Provider/RefetchContext";
// import AuthChecker from "@/utility/AuthChecker"; // Auth check component
// import { AuthProvider } from "@/Provider/AuthContext";
// import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Tools BD",
  description: "Download template, music, videos, and photos",
};

// RootLayout remains a static component without async operations
export default function RootLayout({ children }) {
  return (
    <html lang="en sidebar-scrollbar">
      <body
        className={`${inter.className} sidebar-scrollbar`}
        suppressHydrationWarning={true}
      >
        {/* <AuthProvider> */}
        <RoleProvider>
          <ProviderNextUI>
            <RefetchProvider>
              {/* <AuthChecker>{children}</AuthChecker>  */}
              {children}
            </RefetchProvider>
          </ProviderNextUI>
        </RoleProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
