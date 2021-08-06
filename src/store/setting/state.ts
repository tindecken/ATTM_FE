import { SettingInterface } from 'src/Models/Setting';

export interface SettingStateInterface {
  settings: SettingInterface[];
}

const state: SettingStateInterface = {
  settings: [],
};

export default state;
