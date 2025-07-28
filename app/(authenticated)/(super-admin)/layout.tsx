import { Sidebar } from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar>{children}</Sidebar>
    </div>
  );
};

export default Layout;
