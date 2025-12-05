"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";

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
import type { Trait, Location, Job } from "~/types";

interface Props {
  traits: Trait[];
  locations: Location[];
  jobs: Job[];
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  strength: z.number().min(1).max(10),
  perception: z.number().min(1).max(10),
  endurance: z.number().min(1).max(10),
  charisma: z.number().min(1).max(10),
  intelligence: z.number().min(1).max(10),
  agility: z.number().min(1).max(10),
  luck: z.number().min(1).max(10),
  traitUuid: z.string().min(1, "Please select a trait"),
  locationUuid: z.string().min(1, "Please select a location"),
  jobUuid: z.string().min(1, "Please select a job"),
});

export function CharacterForm({ traits, locations, jobs }: Props) {
  const router = useRouter();

  const createCharacter = api.characters.create.useMutation({
    onSuccess: () => {
      toast.success("Character created successfully!");
      router.push("/characters");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create character");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      strength: 1,
      perception: 1,
      endurance: 1,
      charisma: 1,
      intelligence: 1,
      agility: 1,
      luck: 1,
      traitUuid: "",
      locationUuid: "",
      jobUuid: "",
    },
  });

  const totalPoints =
    form.watch("strength") +
    form.watch("perception") +
    form.watch("endurance") +
    form.watch("charisma") +
    form.watch("intelligence") +
    form.watch("agility") +
    form.watch("luck");

  const pointsRemaining = 28 - totalPoints; // Fallout 4 starts with 28 points (7 stats x 1 base + 21 points)

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedTrait = traits.find((t) => t.uuid === values.traitUuid);
    const selectedJob = jobs.find((j) => j.uuid === values.jobUuid);
    const selectedLocation = locations.find(
      (l) => l.uuid === values.locationUuid,
    );

    if (!selectedTrait || !selectedJob || !selectedLocation) {
      toast.error("Please select all required fields");
      return;
    }

    createCharacter.mutate({
      name: values.name,
      specialStats: {
        strength: values.strength,
        perception: values.perception,
        endurance: values.endurance,
        charisma: values.charisma,
        intelligence: values.intelligence,
        agility: values.agility,
        luck: values.luck,
      },
      trait: { name: selectedTrait.name, uuid: selectedTrait.uuid },
      job: { name: selectedJob.name, uuid: selectedJob.uuid },
      location: { name: selectedLocation.name, uuid: selectedLocation.uuid },
    });
  }

  function handleRandomize() {
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

    if (!randomTrait || !randomJob || !randomLocation) {
      toast.error("Failed to randomize");
      return;
    }

    // Distribute 21 points randomly across SPECIAL stats
    const stats = [1, 1, 1, 1, 1, 1, 1]; // Start with base of 1
    let pointsToDistribute = 21;

    while (pointsToDistribute > 0) {
      const randomIndex = Math.floor(Math.random() * 7);
      if (stats[randomIndex]! < 10) {
        stats[randomIndex]++;
        pointsToDistribute--;
      }
    }

    form.setValue("strength", stats[0]!);
    form.setValue("perception", stats[1]!);
    form.setValue("endurance", stats[2]!);
    form.setValue("charisma", stats[3]!);
    form.setValue("intelligence", stats[4]!);
    form.setValue("agility", stats[5]!);
    form.setValue("luck", stats[6]!);
    form.setValue("traitUuid", randomTrait.uuid);
    form.setValue("jobUuid", randomJob.uuid);
    form.setValue("locationUuid", randomLocation.uuid);

    toast.success("Character randomized!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="border-b border-amber-600/30 pb-4">
          <h2 className="text-3xl font-bold text-amber-100">
            Create Character
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Build your Vault Dweller
          </p>
        </div>

        {/* Character Info Section */}
        <div className="space-y-4 rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
          <h3 className="flex items-center gap-2 text-xl font-bold text-amber-100">
            <span className="text-amber-500">◆</span>
            Character Information
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-100">Character Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter character name"
                    {...field}
                    className="border-amber-600/30 bg-slate-800 text-amber-50 focus:border-amber-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="traitUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100">Trait</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-600/50 bg-slate-800 text-amber-50 focus:border-amber-400">
                        <SelectValue placeholder="Select a trait" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-amber-600/50 bg-slate-800">
                      {traits.map((trait) => (
                        <SelectItem
                          key={trait.uuid}
                          value={trait.uuid}
                          className="text-amber-50 focus:bg-amber-600/30"
                        >
                          {trait.name}
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
              name="jobUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100">Background</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-600/50 bg-slate-800 text-amber-50 focus:border-amber-400">
                        <SelectValue placeholder="Select a background" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-amber-600/50 bg-slate-800">
                      {jobs.map((job) => (
                        <SelectItem
                          key={job.uuid}
                          value={job.uuid}
                          className="text-amber-50 focus:bg-amber-600/30"
                        >
                          {job.name}
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
              name="locationUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-100">
                    Starting Location
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-amber-600/50 bg-slate-800 text-amber-50 focus:border-amber-400">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-amber-600/50 bg-slate-800">
                      {locations.map((location) => (
                        <SelectItem
                          key={location.uuid}
                          value={location.uuid}
                          className="text-amber-50 focus:bg-amber-600/30"
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* S.P.E.C.I.A.L. Stats Section */}
        <div className="space-y-4 rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold text-amber-100">
              <span className="text-amber-500">◆</span>
              S.P.E.C.I.A.L. Stats
            </h3>
            <div
              className={`rounded px-3 py-1 text-sm font-semibold ${
                pointsRemaining < 0
                  ? "border border-red-500/50 bg-red-900/30 text-red-300"
                  : pointsRemaining === 0
                    ? "border border-green-500/50 bg-green-900/30 text-green-300"
                    : "border border-amber-500/50 bg-amber-900/30 text-amber-300"
              }`}
            >
              Points: {pointsRemaining}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Strength
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perception"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Perception
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endurance"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Endurance
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="charisma"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Charisma
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intelligence"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Intelligence
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agility"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Agility
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="luck"
              render={({ field }) => (
                <FormItem className="rounded border border-amber-600/20 bg-slate-800/50 p-3 transition hover:border-amber-600/40">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                    Luck
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="h-10 border-amber-600/30 bg-slate-700 text-center text-lg font-bold text-amber-50 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button
            type="submit"
            disabled={createCharacter.isPending || pointsRemaining !== 0}
            className={`flex-1 py-6 text-lg font-bold uppercase tracking-wider transition ${
              pointsRemaining !== 0
                ? "cursor-not-allowed border border-slate-600 bg-slate-700 text-slate-400"
                : "border border-amber-500 bg-amber-600 text-slate-900 hover:bg-amber-500"
            }`}
          >
            {createCharacter.isPending ? "Creating..." : "Create Character"}
          </Button>
          <Button
            type="button"
            onClick={handleRandomize}
            className="flex-1 border border-amber-600/50 bg-slate-800/50 py-6 text-lg font-bold uppercase tracking-wider text-amber-100 transition hover:border-amber-600/80 hover:bg-slate-700"
          >
            Randomize
          </Button>
        </div>
      </form>
    </Form>
  );
}
