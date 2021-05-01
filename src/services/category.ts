import { Category as CategoryEntity } from '../entities/category';
import * as CategoryTypes from '../types/category';
import * as UserTypes from '../types/user';
import { getManager } from 'typeorm';

class Category {
  get(id: number) {
    return getManager().findOne(CategoryEntity, id);
  }

  getAll() {
    return getManager().find(CategoryEntity);
  }

  create(
    categoryData: CategoryTypes.createData,
    userTokenData: UserTypes.tokenData
  ) {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to create new category.`);
    }
    // TODO: category with same name cant be added
    // can unique key constrain solve this on DB level?

    const category = new CategoryEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(category, categoryData));
  }

  async update(
    categoryData: CategoryTypes.updateData,
    userTokenData: UserTypes.tokenData
  ) {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to update the category.`);
    }

    const category = new CategoryEntity();
    const existingCategory = await getManager().findOne(
      CategoryEntity,
      categoryData.id
    );

    if (existingCategory === undefined) {
      return new Error(`Category not found.`);
    }

    // TODO: category with same name cant be added
    // can unique key constrain solve this on DB level?

    return getManager().save(Object.assign(category, categoryData));
  }

  delete(
    categoryData: CategoryTypes.deleteData,
    userTokenData: UserTypes.tokenData
  ) {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to update the category.`);
    }
    return getManager().delete(CategoryEntity, categoryData.id);
  }
}

export default new Category();
