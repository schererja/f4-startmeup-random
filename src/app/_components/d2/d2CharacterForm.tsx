"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { D2Class, D2Mercenary, D2SkillFocus } from "~/types";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

interface Props {
  classes: D2Class[];
  mercenaries: D2Mercenary[];
  skillFocuses: D2SkillFocus[];
}

const DIFFICULTIES = ["Normal", "Nightmare", "Hell"] as const;
const ACTS = [1, 2, 3, 4, 5] as const;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  classUUID: z.string().min(1, "Please select a class"),
  difficulty: z.enum(DIFFICULTIES),
  startingAct: z.number().int().min(1).max(5),
  mercenaryUUID: z.string().optional(),
});

export function D2CharacterForm({ classes, mercenaries, skillFocuses }: Props) {
  const router = useRouter();

  const createCharacter = api.d2Characters.create.useMutation({
    onSuccess: (character) => {
      toast.success("Character created!");
      router.push(`/diablo2/characters/${character.uuid}`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create character");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      classUUID: "",
      difficulty: "Normal",
      startingAct: 1,
      mercenaryUUID: undefined,
    },
  });

  const selectedClassUUID = form.watch("classUUID");
  const selectedAct = form.watch("startingAct");

  // Derive filtered data from props (no extra API calls needed)
  const filteredMercenaries = mercenaries.filter(
    (m) => m.act === selectedAct,
  );
  const filteredSkillFocuses = selectedClassUUID
    ? skillFocuses.filter((sf) => sf.classUUID === selectedClassUUID)
    : [];

  // Clear mercenary selection when act changes if current selection is invalid
  useEffect(() => {
    const currentMerc = form.getValues("mercenaryUUID");
    if (
      currentMerc &&
      !filteredMercenaries.some((m) => m.uuid === currentMerc)
    ) {
      form.setValue("mercenaryUUID", undefined);
    }
  }, [selectedAct, filteredMercenaries, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCharacter.mutate({
      name: values.name,
      classUUID: values.classUUID,
      difficulty: values.difficulty,
      startingAct: values.startingAct,
      mercenaryUUID: values.mercenaryUUID ?? undefined,
    });
  }

  function handleRandomize() {
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomDifficulty =
      DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
    const randomAct = ACTS[Math.floor(Math.random() * ACTS.length)];
    const mercsForAct = mercenaries.filter((m) => m.act === randomAct);
    const randomMerc =
      mercsForAct.length > 0
        ? mercsForAct[Math.floor(Math.random() * mercsForAct.length)]
        : undefined;

    if (!randomClass || !randomDifficulty || !randomAct) {
      toast.error("Failed to randomize");
      return;
    }

    form.setValue("classUUID", randomClass.uuid);
    form.setValue("difficulty", randomDifficulty);
    form.setValue("startingAct", randomAct);
    form.setValue("mercenaryUUID", randomMerc?.uuid ?? undefined);
    form.setValue(
      "name",
      `${randomClass.name} ${randomDifficulty === "Normal" ? "I" : randomDifficulty === "Nightmare" ? "II" : "III"}`,
    );

    toast.success("Character randomized!");
  }

  const selectedClass = classes.find((c) => c.uuid === selectedClassUUID);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6"
      >
        {/* Header */}
        <div className="border-b border-red-700/30 pb-4">
          <h2 className="text-3xl font-bold text-red-200">Create Character</h2>
          <p className="mt-1 text-sm text-red-300/60">
            Build your Nephalem hero
          </p>
        </div>

        {/* Character Info */}
        <div className="space-y-4 rounded-lg border border-red-700/40 bg-slate-900 p-6 shadow-lg shadow-red-900/20">
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-200">
            <span className="text-red-500">◆</span>
            Character Information
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-red-200">Character Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter character name"
                    {...field}
                    className="border-red-700/30 bg-slate-800 text-amber-50 focus:border-red-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="classUUID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-red-700/50 bg-slate-800 text-amber-50">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-red-700/50 bg-slate-800">
                      {classes.map((cls) => (
                        <SelectItem
                          key={cls.uuid}
                          value={cls.uuid}
                          className="text-amber-50 focus:bg-red-700/30"
                        >
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-red-700/50 bg-slate-800 text-amber-50">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-red-700/50 bg-slate-800">
                      {DIFFICULTIES.map((d) => (
                        <SelectItem
                          key={d}
                          value={d}
                          className="text-amber-50 focus:bg-red-700/30"
                        >
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startingAct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">Starting Act</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="border-red-700/50 bg-slate-800 text-amber-50">
                        <SelectValue placeholder="Select starting act" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-red-700/50 bg-slate-800">
                      {ACTS.map((act) => (
                        <SelectItem
                          key={act}
                          value={String(act)}
                          className="text-amber-50 focus:bg-red-700/30"
                        >
                          Act {act}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mercenaryUUID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-200">
                    Mercenary{" "}
                    <span className="text-red-400/60 font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v === "none" ? undefined : v)
                    }
                    value={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="border-red-700/50 bg-slate-800 text-amber-50">
                        <SelectValue placeholder="No mercenary" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-red-700/50 bg-slate-800">
                      <SelectItem
                        value="none"
                        className="text-amber-50/50 focus:bg-red-700/30"
                      >
                        No mercenary
                      </SelectItem>
                      {filteredMercenaries.map((merc) => (
                        <SelectItem
                          key={merc.uuid}
                          value={merc.uuid}
                          className="text-amber-50 focus:bg-red-700/30"
                        >
                          {merc.name} (Act {merc.act})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {filteredMercenaries.length === 0 && (
                    <p className="text-xs text-red-400/60">
                      No mercenaries available for Act {selectedAct}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Skill Focuses (informational) */}
        {filteredSkillFocuses.length > 0 && (
          <div className="rounded-lg border border-red-700/40 bg-slate-900 p-6 shadow-lg shadow-red-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-red-200">
              <span className="text-red-500">◆</span>
              {selectedClass?.name} Skill Focuses
            </h3>
            <p className="mb-3 text-xs text-red-400/60">
              Available skill paths for reference
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredSkillFocuses.map((sf) => (
                <span
                  key={sf.uuid}
                  className="rounded border border-red-700/40 bg-slate-800 px-2 py-1 text-xs text-red-200"
                  title={sf.description ?? undefined}
                >
                  {sf.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            type="submit"
            disabled={createCharacter.isPending}
            className="flex-1 border border-red-600 bg-red-700 py-6 text-lg font-bold uppercase tracking-wider text-white transition hover:bg-red-600"
          >
            {createCharacter.isPending ? "Creating..." : "Create Character"}
          </Button>
          <Button
            type="button"
            onClick={handleRandomize}
            className="flex-1 border border-red-700/50 bg-slate-800/50 py-6 text-lg font-bold uppercase tracking-wider text-red-200 transition hover:border-red-700 hover:bg-slate-700"
          >
            Randomize
          </Button>
        </div>
      </form>
    </Form>
  );
}
