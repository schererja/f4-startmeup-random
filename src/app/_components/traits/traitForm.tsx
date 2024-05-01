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
  description: z.string().min(2).max(50),
});

export function TraitForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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

              <FormDescription>
                Use this to add in another trait if needed
              </FormDescription>
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

              <FormDescription>
                Use this to add in another trait if needed
              </FormDescription>
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
