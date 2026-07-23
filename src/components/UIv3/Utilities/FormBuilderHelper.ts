import { CategoryData, fieldCategories } from "../Types/toolbar.types"

export const getInitialFieldCategoryData = () => fieldCategories.reduce(
  (acc, { category }) => {
    acc[category] = []
    return acc
  },
  {} as CategoryData
)