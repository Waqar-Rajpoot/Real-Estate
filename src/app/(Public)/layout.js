import Navbar from "@/components/PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {/* pt-20 ensures content starts below the fixed transparent navbar */}
      <main className="min-h-screen ">
        {children}
      </main>
      {/* You can add a Public Footer here later */}
    </>
  );
}