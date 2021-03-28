import { Message as MessageEntity } from '../entities/message';
import { Authorize } from './auth';
import * as MessageTypes from '../types/message';
import { getManager } from 'typeorm';

class Message {
  @Authorize()
  create(messageData: MessageTypes.createData): Promise<MessageEntity> {
    const message = new MessageEntity();
    // TODO: Validation (title not empty, title lenght, subtitle length,...)
    return getManager().save(Object.assign(message, messageData));
  }

  @Authorize()
  update(messageData: MessageTypes.updateData): Promise<MessageEntity> {
    const message = new MessageEntity();
    return getManager().save(Object.assign(message, messageData));
  }

  @Authorize()
  delete(messageData: MessageTypes.deleteData) {
    return getManager().delete(MessageEntity, messageData.id);
  }
}

export default new Message();
