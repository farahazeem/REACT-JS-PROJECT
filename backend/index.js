import { openai } from "./src/api.js";
import fs from "fs";

async function upload() {
  const file = await openai.files.create({
    file: fs.createReadStream("./product-training.jsonl"),
    purpose: "fine-tune",
  });
}

upload();
