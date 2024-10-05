import { Model } from 'pinia-orm'
import { Str, Uid } from 'pinia-orm/decorators'

export default class ProjectUser extends Model {
  static override entity = 'project_users'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare project_id: string
  @Str('') declare user_id: string
}
