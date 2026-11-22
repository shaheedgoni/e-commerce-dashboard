import { GetUser } from "@/lib/services/auth";
import { usePathname, useRouter } from "next/navigation";
import { sidebarContent } from "./sidebar";
import { NoAccessState } from "../ui/state";

export default function AccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = GetUser();

  const blocked =
    user.role !== "admin" &&
    sidebarContent.some(
      (item) => item.adminOnly && pathname.startsWith(item.href),
    );

  if (blocked) {
    return <NoAccessState onBack={() => router.push("/orders")} />;
  }

  return <>{children}</>;
}
