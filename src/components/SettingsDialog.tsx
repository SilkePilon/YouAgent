import React, { useEffect } from "react";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
  FaCoins,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES, GPT_4 } from "../utils/constants";
import Accordion from "./Accordion";
import type { ModelSettings } from "../utils/types";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: [ModelSettings, (settings: ModelSettings) => void];
}> = ({ show, close, customSettings: [customSettings, setCustomSettings] }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings,
  });

  useEffect(() => {
    setSettings(customSettings);
  }, [customSettings, close]);

  const updateSettings = <Key extends keyof ModelSettings>(
    key: Key,
    value: ModelSettings[Key]
  ) => {
    setSettings((prev) => {
      return { ...prev, [key]: value };
    });
  };

  function keyIsValid(key: string | undefined) {
    const pattern = /^sk-[a-zA-Z0-9]{48}$/;
    return key && pattern.test(key);
  }

  const handleSave = () => {

    setCustomSettings(settings);
    close();
    return;
  };

  const disabled = !settings.customApiKey;
  const advancedSettings = (
    <>
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">Loop #: </span>
          </>
        }
        value={settings.customMaxLoops}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("customMaxLoops", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message:
            "Controls the maximum number of loops that the agent will run (higher value will make more API calls).",
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 100,
          step: 1,
        }}
      />
    </>
  );

  return (
    <Dialog
      header="Settings ⚙"
      isShown={show}
      close={close}
      footerButton={<Button onClick={handleSave}>Save</Button>}
    >
      <p>
        Here you can add your BetterAPI API key.
      </p>
      <br />
      <p
        className={
          settings.customModelName === GPT_4
            ? "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
            : ""
        }
      >
        <FaExclamationCircle className="inline-block" />
        &nbsp;
        <b>
          You can get an API key&nbsp;
          <a
            href="https://api.betterapi.net/"
            className="text-blue-500"
          >
            here
          </a>
          . (this does not work atm)
        </b>
      </p>
      <br />
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Key: </span>
            </>
          }
          placeholder={"..."}
          value={settings.customApiKey}
          onChange={(e) => updateSettings("customApiKey", e.target.value)}
        />
        <br className="hidden md:inline" />
        <Accordion
          child={advancedSettings}
          name="Advanced Settings"
        ></Accordion>
        <br />
        <strong className="mt-10">
          NOTE: this project is still in dev!
        </strong>
      </div>
    </Dialog>
  );
};
