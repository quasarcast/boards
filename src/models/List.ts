import { Model } from 'pinia-orm'
import { Str, Uid, Attr, HasManyBy, BelongsTo } from 'pinia-orm/decorators'
import Card from './Card'
import Project from './Project'

export default class List extends Model {
  static override entity = 'lists'
  static override primaryKey = 'id'

  @Uid() declare id: string

  @Str('') declare title: string
  @Attr(() => []) declare card_ids: string[]
  @Str('') declare project_id: string

  @HasManyBy(() => Card, 'card_ids') declare cards: Card[]
  @BelongsTo(() => Project, 'project_id') declare project: Project | null
}
