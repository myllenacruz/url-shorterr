import { IAccessCounterMessage } from '@infrastructure/providers/messageBroker/interfaces/access-counter-message.interface';
import { Logger } from '@nestjs/common';

/**
 *  Mock of the message provided by RMQ.
 * @type {object}
 */
export const contextMessage: object = {};

export const accessCounterMessage: IAccessCounterMessage = {
    shortCode: 'c7e120'
};

export class LoggerMock extends Logger {
    error(message: string, trace: string) {}
}
