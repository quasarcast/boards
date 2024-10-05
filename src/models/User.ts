import { Model } from 'pinia-orm'
import { BelongsToMany, Str, Uid } from 'pinia-orm/decorators'
import ProjectUser from './ProjectUser'
import Project from './Project'

export default class User extends Model {
  static override entity = 'users'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare name: string
  @Str('') declare email: string
  @Str('') declare password: string

  @BelongsToMany(() => ProjectUser, () => User, 'user_id', 'project_id') declare projects: Project[]
}
