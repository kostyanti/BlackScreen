import { defaultSkipKey, SkipKey } from "./SkipKey";

export interface Settings {
    currentSoundValue: number;

    SelectedSpeed: number;
    SelectedQuality: number;
    SkipKeys: boolean;
    AutoPlay: boolean;
    SleepCheckTimer: number;

    skipKeys: SkipKey[];

    playerMainColor: string;
    playerSecondColorR: number;
    playerSecondColorG: number;
    playerSecondColorB: number;
}

export const defaultSettings: Settings = {
    currentSoundValue: 0,

    SelectedSpeed: 1,
    SelectedQuality: 1,
    SkipKeys: false,
    AutoPlay: false,
    SleepCheckTimer: 1,

    skipKeys: [],

    playerMainColor: "#D9D9D9",
    playerSecondColorR: 100,
    playerSecondColorG: 100,
    playerSecondColorB: 100
}