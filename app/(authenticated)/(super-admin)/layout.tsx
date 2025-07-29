import { Sidebar } from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Sidebar>{children}</Sidebar>;
};

export default Layout;
