
        import dotenv from "dotenv";
        import { config as winstonConfig } from "winston";

        interface Config {
          port: number;
          webhookSecret: string;
          jwtKey: string;
        }

        const config = dotenv.config().parsed as unknown as Config;

        if (!config) {
          throw new Error("Failed to load environment variables");
        }

        export default config;
      