import { Model } from 'pinia-orm'
import { Attr, BelongsTo, HasManyBy, Str, Uid } from 'pinia-orm/decorators'
import CardGroup from './CardGroup'
import Project from './Project'

export default class Board extends Model {
  static override entity = 'boards'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare title: string
  @Str('') declare description: string
  @Str('') declare project_id: string
  @Attr(() => []) declare card_group_ids: string[]

  @BelongsTo(() => Project, 'project_id') declare project: Project | null
  @HasManyBy(() => CardGroup, 'card_group_ids') declare card_groups: CardGroup[]
}
