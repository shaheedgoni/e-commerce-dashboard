import Sidebar from "@/components/navigation/sidebar";
// import Header from "@/components/navigation/header"; // add once you build it

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <Header /> */}

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
