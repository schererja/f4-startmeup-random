import { redirect } from "next/navigation";

export default function Page({ params }: { params: { uuid: string } }) {
  redirect(`/fallout4/characters/${params.uuid}`);
}
