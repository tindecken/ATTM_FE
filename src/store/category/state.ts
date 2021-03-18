import { CategoryInterface } from "src/Models/Category";

export interface CategoryStateInterface {
  Categories: CategoryInterface[];
  SelectedCategory?: CategoryInterface;
}

const state: CategoryStateInterface = {
  Categories: [],
  SelectedCategory: undefined,
};

export default state;
