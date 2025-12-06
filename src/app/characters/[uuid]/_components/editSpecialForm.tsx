"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface EditSpecialFormProps {
  statsUuid: string;
  initialStats: {
    strength: number;
    perception: number;
    endurance: number;
    charisma: number;
    intelligence: number;
    agility: number;
    luck: number;
  };
  onSave?: () => void;
}

export function EditSpecialForm({
  statsUuid,
  initialStats,
  onSave,
}: EditSpecialFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState(initialStats);

  const updateStats = api.specials.update.useMutation({
    onSuccess: () => {
      toast.success("SPECIAL stats updated!");
      setIsEditing(false);
      onSave?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update stats");
    },
  });

  const handleSave = () => {
    updateStats.mutate({
      uuid: statsUuid,
      strength: stats.strength,
      perception: stats.perception,
      endurance: stats.endurance,
      charisma: stats.charisma,
      intelligence: stats.intelligence,
      agility: stats.agility,
      luck: stats.luck,
    });
  };

  const handleCancel = () => {
    setStats(initialStats);
    setIsEditing(false);
  };

  const statFields = [
    { key: "strength" as const, label: "Strength", abbr: "S" },
    { key: "perception" as const, label: "Perception", abbr: "P" },
    { key: "endurance" as const, label: "Endurance", abbr: "E" },
    { key: "charisma" as const, label: "Charisma", abbr: "C" },
    { key: "intelligence" as const, label: "Intelligence", abbr: "I" },
    { key: "agility" as const, label: "Agility", abbr: "A" },
    { key: "luck" as const, label: "Luck", abbr: "L" },
  ];

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statFields.map(({ key, abbr }) => (
            <div
              key={key}
              className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                {abbr}
              </p>
              <p className="mt-3 text-5xl font-bold text-amber-100">
                {stats[key]}
              </p>
            </div>
          ))}
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="mt-4 border border-amber-600/50 bg-amber-600/20 text-amber-100 hover:bg-amber-600/30"
        >
          Edit Stats
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-amber-500">
              {label}
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={stats[key]}
              onChange={(e) =>
                setStats((prev) => ({
                  ...prev,
                  [key]: parseInt(e.target.value),
                }))
              }
              className="border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-100 focus:border-amber-500"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={updateStats.isPending}
          className="flex-1 border border-amber-500 bg-amber-600 text-slate-900 hover:bg-amber-500"
        >
          {updateStats.isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          onClick={handleCancel}
          disabled={updateStats.isPending}
          className="flex-1 border border-amber-600/50 bg-slate-800/50 text-amber-100 hover:border-amber-600/80 hover:bg-slate-700"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
