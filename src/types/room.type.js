// import {} from './func.type.js';

/**
 * @typedef {Object} Room
 * @property {String} id
 * @property {String} name
*/

/** @enum {String} */
export const RoomAction = {
  CREATE: 'CREATE_ROOM',
  DELETE: 'DELETE_ROOM',
  RENAME: 'RENAME_ROOM',
  UPDATE: 'UPDATE_ROOMS',
  ENTER: 'ENTER_THE_ROOM',
  LEAVE: 'LEAVE_THE_ROOM',
};
