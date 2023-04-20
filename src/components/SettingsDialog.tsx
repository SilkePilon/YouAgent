import React from "react";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import {
  GPT_MODEL_NAMES,
  GPT_4,
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
} from "../utils/constants";
import Accordion from "./Accordion";
import type { reactModelStates } from "./types";

export default function SettingsDialog({
  show,
  close,
  reactModelStates,
}: {
  show: boolean;
  close: () => void;
  reactModelStates: reactModelStates;
}) {
  const {
    customApiKey,
    setCustomApiKey,
    customModelName,
    setCustomModelName,
    customTemperature,
    setCustomTemperature,
    customMaxLoops,
    setCustomMaxLoops,
  } = reactModelStates;
  

  const [key, setKey] = React.useState<string>(customApiKey);

  const handleClose = () => {
    setKey(customApiKey);
    close();
  };

  function is_valid_key(key: string) {
    return true
  }

  const handleSave = () => {
    if (is_valid_key(key)) {
      setCustomApiKey(key);
      close();
    } else {
      alert(
        "key is invalid, please try again"
      );
    }
  };

  React.useEffect(() => {
    setCustomMaxLoops(
      key ? DEFAULT_MAX_LOOPS_CUSTOM_API_KEY : DEFAULT_MAX_LOOPS_FREE
    );

    return () => {
      setCustomMaxLoops(DEFAULT_MAX_LOOPS_FREE);
    };
  }, [key, setCustomMaxLoops]);

  const advancedSettings = (
    <>
      
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">Loop #: </span>
          </>
        }
        value={customMaxLoops}
        disabled={!key}
        onChange={(e) => setCustomMaxLoops(parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message:
            "Controls the maximum number of loops that the agent will run (higher value will make more API calls).",
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 20,
          step: 1,
        }}
      />
    </>
  );

  return (
    <Dialog
      header="Settings ⚙"
      isShown={show}
      close={handleClose}
      footerButton={<Button onClick={handleSave}>Save</Button>}
    >
      <p>
        Here you can add your BetterAPI API key.
      </p>
      <br />
      <p
        className={
          customModelName === GPT_4
            ? "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
            : ""
        }
      >
        <FaExclamationCircle className="inline-block" />
        &nbsp;
        <b>
          This project is based on You.com's&nbsp;
          <a
            href="https://you.com"
            className="text-blue-500"
          >
          YouChat
          </a>
          .
        </b>
      </p>
      <br />
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        
        <br className="hidden md:inline" />
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Key: </span>
            </>
          }
          placeholder={"..."}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <br className="md:inline" />
        <Accordion
          child={advancedSettings}
          name="Advanced Settings"
        ></Accordion>
        <br />
        <strong className="mt-10">
          NOTE: To get a key, visit the
          following{" "}
          <a
            href="https://betterapi.net/"
            className="text-blue-500"
          >
            link.
          </a>{" "}
          This key is only used in the current browser session
        </strong>
      </div>
    </Dialog>
  );
}
