import { api } from "~/trpc/server";
import { D2CharacterForm } from "~/app/_components/d2/d2CharacterForm";

export default async function Page() {
  const [classes, mercenaries, skillFocuses] = await Promise.all([
    api.d2GameData.getClasses(),
    api.d2GameData.getMercenaries({}),
    api.d2GameData.getSkillFocuses({}),
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <D2CharacterForm
          classes={classes}
          mercenaries={mercenaries}
          skillFocuses={skillFocuses}
        />
      </div>
    </div>
  );
}

