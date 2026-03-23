import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: ["./src/server/db/schema.ts", "./src/server/db/schema-d2.ts"],
  driver: "pg",
  out: "./drizzle",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
  tablesFilter: ["f4sr_*", "d2_*"],
} satisfies Config;
