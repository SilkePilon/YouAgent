import React from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Dialog from "./Dialog";

export default function HelpDialog({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) {
  return (
    <Dialog header="Welcome to YouAgent 🤖" isShown={show} close={close}>
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <p>
          <strong>YouAgent</strong> allows you to configure and deploy
          Autonomous AI agents. Name your custom AI and have it embark on any
          goal imaginable. It will attempt to reach the goal by thinking of
          tasks to do, executing them, and learning from the results 🚀
        </p>
        <div>
          <br />
          This platform is currently in beta, we are currently working on:
          <ul className="ml-5 list-inside list-disc">
            <li>Long term memory 🧠</li>
            <li>Web browsing 🌐</li>
            <li>Interaction with websites and people 👨‍👩‍👦</li>
          </ul>
          <br />
          <p className="mt-2">Follow the journey below:</p>
        </div>
        <div className="mt-4 flex w-full items-center justify-center gap-5">
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open("https://discord.gg/youclub", "_blank")
            }
          >
            <FaDiscord size={30} />
          </div>
          
          <div
            className="cursor-pointer rounded-full bg-black/30 p-3 hover:bg-black/70"
            onClick={() =>
              window.open("https://github.com/SilkePilon/YouAgent", "_blank")
            }
          >
            <FaGithub size={30} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
