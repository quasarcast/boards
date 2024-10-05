import { Model } from 'pinia-orm'
import { BelongsTo, BelongsToMany, Str, Uid } from 'pinia-orm/decorators'
import User from './User'
import ProjectUser from './ProjectUser'

export default class Project extends Model {
  static override entity = 'projects'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare name: string
  @Str('') declare owner_id: string

  @BelongsTo(() => User, 'owner_id') declare owner: User | null
  @BelongsToMany(() => User, () => ProjectUser, 'project_id', 'user_id') declare users: User[]
}
