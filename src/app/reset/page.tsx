import ResetPasswordPage from "@/components/ui/Pages/ResetPasswordPage";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <ResetPasswordPage token={token} />;
}
