import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "@iarna/toml";

const dataDirectory = fileURLToPath(new URL("../../data/", import.meta.url));

export function getContentFile<TContent>(fileName: string): TContent {
  const rawContent = readFileSync(`${dataDirectory}${fileName}.toml`, "utf-8");
  return parse(rawContent) as TContent;
}
