import { Category as CategoryEntity } from '../entities/category';
import { Authorize } from './auth';
import * as CategoryTypes from '../types/category';
import * as UserTypes from '../types/user';
import { getManager } from 'typeorm';

class Category {
  @Authorize(UserTypes.Role.Subscriber)
  get(id: number, authToken: string) {
    return getManager().findOne(CategoryEntity, id);
  }

  @Authorize(UserTypes.Role.Subscriber)
  getAll(categoryData: CategoryTypes.getData, authToken: string) {
    return getManager().find(CategoryEntity);
  }

  @Authorize()
  create(categoryData: CategoryTypes.createData, authToken: string) {
    const category = new CategoryEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(category, categoryData));
  }

  @Authorize()
  update(categoryData: CategoryTypes.updateData, authToken: string) {
    const category = new CategoryEntity();
    return getManager().save(Object.assign(category, categoryData));
  }

  @Authorize()
  delete(categoryData: CategoryTypes.deleteData, authToken: string) {
    return getManager().delete(CategoryEntity, categoryData.id);
  }
}

export default new Category();
