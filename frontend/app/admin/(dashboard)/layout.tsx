import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex flex-col md:flex-row">
        <AdminNav />
        <div className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-8">{children}</div>
      </div>
    </AdminGuard>
  );
}
