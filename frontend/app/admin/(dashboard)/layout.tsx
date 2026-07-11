import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex">
        <AdminNav />
        <div className="flex-1 px-8 py-8">{children}</div>
      </div>
    </AdminGuard>
  );
}
