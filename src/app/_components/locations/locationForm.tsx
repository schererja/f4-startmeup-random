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
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export function LocationForm() {
  const { isSignedIn, sessionId, userId } = useAuth();

  if (isSignedIn && userId !== "user_2fkxhXmMfx2RdGSRFLPaG0qEInV") {
    return (
      <div>
        <h1>You are not authorized to add to Locations</h1>
      </div>
    );
  }
  const router = useRouter();
  const [name, setName] = useState("");
  const createlocation = api.locations.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
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
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createlocation.mutate({ name });
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

        <Button type="submit" disabled={createlocation.isPending}>
          {createlocation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
