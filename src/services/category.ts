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

  create(categoryData: CategoryTypes.createData) {
    const category = new CategoryEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(category, categoryData));
  }

  update(categoryData: CategoryTypes.updateData) {
    const category = new CategoryEntity();
    return getManager().save(Object.assign(category, categoryData));
  }

  delete(categoryData: CategoryTypes.deleteData) {
    return getManager().delete(CategoryEntity, categoryData.id);
  }
}

export default new Category();
