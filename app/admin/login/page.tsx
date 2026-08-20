import { PawHeartLogo } from "@/components/brand/PawHeartLogo";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-blue-light px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <PawHeartLogo className="h-12 w-12 text-brand-blue" />
          <h1 className="mt-2 text-center text-lg font-bold text-brand-navy">
            Cão Idoso UNIFRAN
            <br />
            Administração
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
