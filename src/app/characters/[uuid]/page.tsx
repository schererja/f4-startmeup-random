import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { uuid: string } }) {
  const data = await api.characters.getByUUID({ uuid: params.uuid });
  if (!data) {
    return <div>Character not found</div>;
  }
  return (
    <div className="p-12">
      <h1>Name: {data.character.name}</h1>
      <h1>Job: {data.job?.name}</h1>
      <h1>Starting Location: {data.location?.name}</h1>
      <h1>Trait: {data.trait?.name}</h1>
      <h1>Starting Stats</h1>
      <li>Strength: {data.specialStats?.strength}</li>
      <li>Perception: {data.specialStats?.perception}</li>
      <li>Endurance: {data.specialStats?.endurance}</li>
      <li>Charisma: {data.specialStats?.charisma}</li>
      <li>Intelligence: {data.specialStats?.intelligence}</li>
      <li>Agility: {data.specialStats?.agility}</li>
      <li>Luck: {data.specialStats?.luck}</li>
    </div>
  );
}
