import { redirect } from 'next/navigation';

export default async function OldProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/editor/${id}`);
}
