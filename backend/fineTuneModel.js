import { openai } from "./src/api.js";

async function createFineTuneModel() {
  try {
    const model = await openai.fineTuning.jobs.create({
      training_file: "file-oOlvMQHLtxh61X4euIHjxBp9", //id got by running upload() function (inside backend: index.js file)
      model: "ft:gpt-3.5-turbo-0125:software-developer::ATgUdTfR", //note: its the model Id (we get after successful fine tunning) not the job id
    });
    console.log(model);
  } catch (error) {
    console.error(error);
  }
}

createFineTuneModel();
