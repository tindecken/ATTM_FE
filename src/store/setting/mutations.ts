import { SettingInterface } from 'src/Models/Setting';
import { MutationTree } from 'vuex';
import { SettingStateInterface } from './state';

const mutation: MutationTree<SettingStateInterface> = {
  setSettings(state: SettingStateInterface, settings: SettingInterface[]): void {
    state.settings = settings;
  },
  updateSettings(state: SettingStateInterface, setting: SettingInterface): void {
    const { settings } = state;
    const index = settings.findIndex((s: SettingInterface) => s.Id === setting.Id);
    if (index >= 0) {
      settings[index] = setting;
    }
  },
}

export default mutation;
