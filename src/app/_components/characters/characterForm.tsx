"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
interface Trait {
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  uuid: string | null;
}

interface Location {
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  uuid: string | null;
}

interface Job {
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  uuid: string | null;
}
interface Props {
  traits: Trait[];
  locations: Location[];
  jobs: Job[];
}
const formSchema = z.object({
  name: z.string().min(2).max(50),
  strength: z.number().min(1).max(10),
  perception: z.number().min(1).max(10),
  endurance: z.number().min(1).max(10),
  charisma: z.number().min(1).max(10),
  intelligence: z.number().min(1).max(10),
  agility: z.number().min(1).max(10),
  luck: z.number().min(1).max(10),
  trait: z.object({ name: z.string().min(1), uuid: z.string().min(1) }),
  location: z.object({ name: z.string().min(1), uuid: z.string().min(1) }),
  job: z.object({ name: z.string().min(1), uuid: z.string().min(1) }),
});

export function CharacterForm(props: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [strength, setStrength] = useState(1);
  const [perception, setPerception] = useState(1);
  const [endurance, setEndurance] = useState(1);
  const [charisma, setCharisma] = useState(1);
  const [intelligence, setIntelligence] = useState(1);
  const [agility, setAgility] = useState(1);
  const [luck, setLuck] = useState(1);

  const [trait, setTrait] = useState({ name: "", uuid: "" });
  const [location, setLocation] = useState({ name: "", uuid: "" });
  const [job, setJob] = useState({ name: "", uuid: "" });

  const createjob = api.characters.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setStrength(1);
      setPerception(1);
      setEndurance(1);
      setCharisma(1);
      setIntelligence(1);
      setAgility(1);
      setLuck(1);
      setTrait({ name: "", uuid: "" });
      setLocation({ name: "", uuid: "" });
      setJob({ name: "", uuid: "" });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 1. Define your form.
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
      trait: { name: "", uuid: "" },
      location: { name: "", uuid: "" },
      job: { name: "", uuid: "" },
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createjob.mutate({
            name,
            specialStats: {
              strength,
              perception,
              endurance,
              charisma,
              intelligence,
              agility,
              luck,
            },
            trait,
            location,
            job,
          });
        }}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="flex">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="perception"
          render={({ field }) => (
            <div className="flex">
              <FormItem>
                <FormLabel>Perception</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Perception"
                    {...field}
                    value={perception}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input placeholder="Strength" {...field} value={strength} />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="endurance"
          render={({ field }) => (
            <div className="flex">
              <FormItem>
                <FormLabel>Endurance</FormLabel>
                <FormControl>
                  <Input placeholder="Endurance" {...field} value={endurance} />
                </FormControl>

                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Charisma</FormLabel>
                <FormControl>
                  <Input placeholder="Charisma" {...field} value={charisma} />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="intelligence"
          render={({ field }) => (
            <div className="flex">
              <FormItem>
                <FormLabel>Intelligence</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Intelligence"
                    {...field}
                    value={intelligence}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Agility</FormLabel>
                <FormControl>
                  <Input placeholder="Agility" {...field} value={agility} />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="luck"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luck</FormLabel>
              <FormControl>
                <Input placeholder="Luck" {...field} value={luck} />
              </FormControl>
              <FormDescription>
                Use this to add in another job if needed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trait"
          render={({ field }) => (
            <div className="flex">
              <FormItem>
                <FormLabel>Trait</FormLabel>
                <FormControl>
                  <Input placeholder="Trait" {...field} value={trait.name} />
                </FormControl>

                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Job</FormLabel>
                <FormControl>
                  <Input placeholder="Job" {...field} value={job.name} />
                </FormControl>

                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Location"
                  {...field}
                  value={location.name}
                />
              </FormControl>
              <FormDescription>
                Use this to add in another job if needed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={createjob.isPending}
          onClick={async (e) => {
            e.preventDefault();
            if (!props.traits && !props.locations && !props.jobs) {
              return;
            }
            const randomTrait =
              props.traits[Math.floor(Math.random() * props.traits.length)];
            const randomLocation =
              props.locations[
                Math.floor(Math.random() * props.locations.length)
              ];
            const randomJob =
              props.jobs[Math.floor(Math.random() * props.jobs.length)];

            let numberOfStartingStats = 21;
            let newStrength = 1;
            let newPerception = 1;
            let newEndurance = 1;
            let newCharisma = 1;
            let newIntelligence = 1;
            let newAgility = 1;
            let newLuck = 1;
            for (let i = 1; i >= 0; i++) {
              if (numberOfStartingStats == 0) {
                break;
              }
              const randomNumber = Math.floor(Math.random() * 7) + 1;
              switch (randomNumber) {
                case 1:
                  newStrength += 1;
                  break;
                case 2:
                  newPerception += 1;
                  break;
                case 3:
                  newEndurance += 1;
                  break;
                case 4:
                  newCharisma += 1;
                  break;
                case 5:
                  newIntelligence += 1;
                  break;
                case 6:
                  newAgility += 1;
                  break;
                case 7:
                  newLuck += 1;
                  break;
                default:
                  break;
              }
              if (!randomTrait || !randomJob || !randomLocation) {
                return;
              }
              if (
                randomTrait.name == null ||
                randomJob.name == null ||
                randomLocation.name == null ||
                randomTrait.uuid == null ||
                randomJob.uuid == null ||
                randomLocation.uuid == null ||
                randomTrait.name == "" ||
                randomJob.name == ""
              ) {
                return;
              }
              setStrength(newStrength);
              setPerception(newPerception);
              setEndurance(newEndurance);
              setCharisma(newCharisma);
              setIntelligence(newIntelligence);
              setAgility(newAgility);
              setLuck(newLuck);
              setTrait({ name: randomTrait.name, uuid: randomTrait.uuid });
              setJob({ name: randomJob.name, uuid: randomJob.uuid });
              setLocation({
                name: randomLocation.name,
                uuid: randomLocation.uuid,
              });
              numberOfStartingStats -= 1;
            }
          }}
        >
          {createjob.isPending ? "Generating..." : "Generate"}
        </Button>
        <Button type="submit" disabled={createjob.isPending}>
          {createjob.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
