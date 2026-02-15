import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
  return (
    <main className="">
      {children}
      {/* <Toaster/> */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
        }}
      />
    </main>
  );
}
