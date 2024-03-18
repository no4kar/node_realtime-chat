// import { } from './func.type.js';

/**
 * @typedef {Object} Message
 * @property {String} roomId
 * @property {String} text
 * @property {String} author
 * @property {Date} createdAt
*/

/**
 * @typedef {Object} MessageClient
 * @property {MessageAction} action
 * @property {any} payload
*/

/** @enum {String} */
export const MessageAction = {
  CREATE: 'CREATE_MESSAGE',
};
