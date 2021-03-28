import { Category as CategoryEntity } from '../entities/category';
import { Authorize } from './auth';
import * as CategoryTypes from '../types/category';
import { getManager } from 'typeorm';

class Category {
  @Authorize()
  create(categoryData: CategoryTypes.createData) {
    const category = new CategoryEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(category, categoryData));
  }

  @Authorize()
  update(categoryData: CategoryTypes.updateData) {
    const category = new CategoryEntity();
    return getManager().save(Object.assign(category, categoryData));
  }

  @Authorize()
  delete(categoryData: CategoryTypes.deleteData) {
    return getManager().delete(CategoryEntity, categoryData.id);
  }
}

export default new Category();
