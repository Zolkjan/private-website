import VideoForm from "@/components/admin/VideoForm";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VideoForm key={id} videoId={id} />;
}
