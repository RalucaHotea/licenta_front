import { RoleType } from '../enums/role-type.enum';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roleType: RoleType;
  group: string;
  category: Category;
  subcategory: Subcategory;
  totalBenefit: number;
  officeStreetAddress: string;
  officeCity: string;
  officeCountry: string;
}
