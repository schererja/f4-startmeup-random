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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});

export function TraitForm() {
  const { isSignedIn, userId } = useAuth();

  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const createTrait = api.traits.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isSignedIn && userId !== "user_2fkxhXmMfx2RdGSRFLPaG0qEInV") {
    return (
      <div>
        <h1>You are not authorized to add to Traits</h1>
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTrait.mutate({ name, description });
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
                  placeholder="shadcn"
                  {...field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createTrait.isPending}>
          {createTrait.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
