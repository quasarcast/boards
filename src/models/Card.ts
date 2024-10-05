import { Model } from 'pinia-orm'
import { BelongsTo, Str, Uid } from 'pinia-orm/decorators'
import Project from './Project'

export default class Card extends Model {
  static override entity = 'cards'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare title: string
  @Str('') declare description: string
  @Str('') declare project_id: string

  @BelongsTo(() => Project, 'project_id') declare project: Project | null
}
