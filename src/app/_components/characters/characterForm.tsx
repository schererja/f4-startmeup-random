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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  strength: z.number().min(1).max(10),
  perception: z.number().min(1).max(10),
  endurance: z.number().min(1).max(10),
  charisma: z.number().min(1).max(10),
  intelligence: z.number().min(1).max(10),
  agility: z.number().min(1).max(10),
  luck: z.number().min(1).max(10),
  trait: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  job: z.string().min(2).max(50),
});

export function CharacterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [strength, setStrength] = useState(1);
  const [perception, setPerception] = useState(1);
  const [endurance, setEndurance] = useState(1);
  const [charisma, setCharisma] = useState(1);
  const [intelligence, setIntelligence] = useState(1);
  const [agility, setAgility] = useState(1);
  const [luck, setLuck] = useState(1);
  const [trait, setTrait] = useState("");
  const [location, setLocation] = useState("");
  const [job, setJob] = useState("");
  const createjob = api.jobs.create.useMutation({
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
      setTrait("");
      setLocation("");
      setJob("");
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
      trait: "",
      location: "",
      job: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createjob.mutate({ name });
        }}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
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

              <FormDescription>
                Use this to add in another job if needed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strength</FormLabel>
              <FormControl>
                <Input
                  placeholder="Strength"
                  {...field}
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                />
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
          name="perception"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perception</FormLabel>
              <FormControl>
                <Input
                  placeholder="Perception"
                  {...field}
                  value={perception}
                  onChange={(e) => setPerception(e.target.value)}
                />
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
          name="endurance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endurance</FormLabel>
              <FormControl>
                <Input
                  placeholder="Endurance"
                  {...field}
                  value={endurance}
                  onChange={(e) => setEndurance(e.target.value)}
                />
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
          name="charisma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charisma</FormLabel>
              <FormControl>
                <Input
                  placeholder="Charisma"
                  {...field}
                  value={charisma}
                  onChange={(e) => setCharisma(e.target.value)}
                />
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
          name="intelligence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intelligence</FormLabel>
              <FormControl>
                <Input
                  placeholder="Intelligence"
                  {...field}
                  value={intelligence}
                  onChange={(e) => setIntelligence(e.target.value)}
                />
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
          name="agility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agility</FormLabel>
              <FormControl>
                <Input
                  placeholder="Agility"
                  {...field}
                  value={agility}
                  onChange={(e) => setAgility(e.target.value)}
                />
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
          name="luck"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luck</FormLabel>
              <FormControl>
                <Input
                  placeholder="Luck"
                  {...field}
                  value={luck}
                  onChange={(e) => setLuck(e.target.value)}
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
          onClick={(e) => {
            e.preventDefault();

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
              let randomNumber = Math.floor(Math.random() * 7) + 1;
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
              setStrength(newStrength);
              setPerception(newPerception);
              setEndurance(newEndurance);
              setCharisma(newCharisma);
              setIntelligence(newIntelligence);
              setAgility(newAgility);
              setLuck(newLuck);

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
