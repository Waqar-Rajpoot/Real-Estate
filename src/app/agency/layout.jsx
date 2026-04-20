import AgencyNavbar from "@/components/AgencyNavbar";

export default function AgencyLayout({ children }) {
  return (
    <section>
      <AgencyNavbar />
      <main>{children}</main>
    </section>
  );
}