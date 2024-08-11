import { program } from "commander";
import { clickhouseManager } from "../lib/clickhouse";

program
  .name("database-cli")
  .description("CLI for managing the ClickHouse database");

program
  .command("setup")
  .description("Set up the database and run all migrations")
  .action(async () => {
    try {
      await clickhouseManager.setupDatabase();
      console.log("Database setup completed successfully.");
    } catch (error) {
      console.error("Error setting up database:", error);
    }
    process.exit();
  });
program.parse(process.argv);
