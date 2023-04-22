import {
  createModel,
  startGoalPrompt,
  executeTaskPrompt,
  createTasksPrompt,
} from "../utils/prompts";
import type { ModelSettings } from "../utils/types";
import { env } from "../env/client.mjs";
import { LLMChain } from "langchain/chains";
import { extractTasks } from "../utils/helpers";

async function startGoalAgent(modelSettings: ModelSettings, goal: string) {
  // const completion = await new LLMChain({
  //   llm: createModel(modelSettings),
  //   prompt: startGoalPrompt,
  // }).call({
  //   goal,
  // });
  // const apikey = modelSettings.customApiKey === ""? modelSettings.customApiKey

  const response = await fetch(`https://api.betterapi.net/youdotcom/chat?message=${encodeURIComponent(`You are an autonomous task creation A called AgentGPT. You have the following objective '${goal}'. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()`)}&key=site`);
  const completion = await response.json();
  console.log("Completion:" + (completion.message as string));
  return extractTasks(completion.message as string, []);
}

async function executeTaskAgent(
  modelSettings: ModelSettings,
  goal: string,
  task: string
) {
  // const completion = await new LLMChain({
  //   llm: createModel(modelSettings),
  //   prompt: executeTaskPrompt,
  // }).call({
  //   goal,
  //   task,
  // });

  const response = await fetch(`https://api.betterapi.net/youdotcom/chat?message=${encodeURIComponent(`You are an autonomous task execution AI called AgentGPT. You have the following objective '${goal}'. You have the following tasks '${task}'. Execute the task and return the response as a string.`)}&key=site`);
  const completion = await response.json();

  return completion.message as string;
}

async function createTasksAgent(
  modelSettings: ModelSettings,
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string,
  completedTasks: string[] | undefined
) {
  // const completion = await new LLMChain({
  //   llm: createModel(modelSettings),
  //   prompt: createTasksPrompt,
  // }).call({
  //   goal,
  //   tasks,
  //   lastTask,
  //   result,
  // });

  const response = await fetch(`https://api.betterapi.net/youdotcom/chat?message=${encodeURIComponent(`You are an AI task creation agent. You have the following objective '${goal}'. You have the following incomplete tasks '${tasks}' and have just executed the following task '${lastTask}' and received the following result '${result}'. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE`)}&key=site`);
  const completion = await response.json();

  return extractTasks(completion.message as string, completedTasks || []);
}

interface AgentService {
  startGoalAgent: (
    modelSettings: ModelSettings,
    goal: string
  ) => Promise<string[]>;
  executeTaskAgent: (
    modelSettings: ModelSettings,
    goal: string,
    task: string
  ) => Promise<string>;
  createTasksAgent: (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => Promise<string[]>;
}

const OpenAIAgentService: AgentService = {
  startGoalAgent: startGoalAgent,
  executeTaskAgent: executeTaskAgent,
  createTasksAgent: createTasksAgent,
};

const MockAgentService: AgentService = {
  startGoalAgent: async (modelSettings, goal) => {
    return await new Promise((resolve) => resolve(["Task 1"]));
  },

  createTasksAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => {
    return await new Promise((resolve) => resolve(["Task 4"]));
  },

  executeTaskAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    task: string
  ) => {
    return await new Promise((resolve) => resolve("Result: " + task));
  },
};

export default env.NEXT_PUBLIC_FF_MOCK_MODE_ENABLED
  ? MockAgentService
  : OpenAIAgentService;
