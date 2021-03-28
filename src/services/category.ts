import { Category as CategoryEntity } from '../entities/category';
import * as CategoryTypes from '../types/category';
import { getManager } from 'typeorm';

class Category {
  async create(categoryData: CategoryTypes.createData) {
    const category = new CategoryEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(category, categoryData));
  }
}

export default new Category();
