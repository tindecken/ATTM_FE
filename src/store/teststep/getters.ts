import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { TestStepStateInterface } from "./state";

const getters: GetterTree<TestStepStateInterface, StateInterface> = {
  copiedTestSteps(state: TestStepStateInterface) {
    return state.copiedTestSteps;
  },
};

export default getters;
