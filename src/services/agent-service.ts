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
import axios from "axios";
import {
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
  DEFAULT_MAX_LOOPS_PAID,
} from "../utils/constants";
import type { Session } from "next-auth";
import type { Message } from "../types/agentTypes";
import { v4 } from "uuid";
import type { RequestBody } from "../utils/interfaces";




async function fetchData(text:string) {
  const url = `https://api.betterapi.net/youdotcom/chat?message=${encodeURIComponent(text)}&key=site`;
  
  while (true) {
    const response = await fetch(url, {mode: 'cors'});
    if (!response.ok) {
      console.log(`Error: ${response.status} - ${response.statusText}`);
      this.renderMessage
      await new Promise(resolve => setTimeout(resolve, 60000)); // wait for 1 minute
    } else {
      return await response.json();
    }
  }
}

async function startGoalAgent(modelSettings: ModelSettings, goal: string) {
  // const completion = await new LLMChain({
  //   llm: createModel(modelSettings),
  //   prompt: startGoalPrompt,
  // }).call({
  //   goal,
  // });
  // const apikey = modelSettings.customApiKey === ""? modelSettings.customApiKey

  const response = await fetchData(`You are an autonomous task creation A called AgentGPT. You have the following objective '${goal}'. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()`);
  console.log("Completion:" + (response.message as string));
  return extractTasks(response.message as string, []);
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

  const response = await fetchData(`You are an autonomous task execution AI called AgentGPT. You have the following objective '${goal}'. You have the following tasks '${task}'. Execute the task and return the response as a string.`);

  return response.message as string;
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

  const response = await fetchData(`You are an AI task creation agent. You have the following objective '${goal}'. You have the following incomplete tasks '${tasks}' and have just executed the following task '${lastTask}' and received the following result '${result}'. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE`);

  return extractTasks(response.message as string, completedTasks || []);
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
