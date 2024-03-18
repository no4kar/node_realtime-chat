import * as roomService from '../services/room.service.js';
import { ApiError } from '../exceptions/api.error.js';

/** @typedef {import('../types/func.type.js').TyFuncController} TyRoomController*/

/** @type {TyRoomController} */
export async function getAll(req, res) {
  const rooms = await roomService.getAll();

  return res
    .status(200)
    .send(rooms.map(roomService.normalize));
}

/** @type {TyRoomController} */
export async function getByName(req, res) {
  const { name } = req.params;

  const rooms = await roomService.getByName(name)

  if (!rooms.length) {
    throw ApiError.NotFound();
  }

  return res
    .status(200)
    .send(rooms.map(roomService.normalize));
}

/** @type {TyRoomController} */
export async function post(req, res) {
  const { name } = req.body;

  if (!name) {
    throw ApiError.BadRequest();
  }

  if (await roomService.count({ where: { name } })) {
    throw ApiError.StatusConflict('Room already exists');
  }

  if ((await roomService.count()) >= 5) {
    throw ApiError.Forbidden('Room limit exceeded. Cannot create more than 5 rooms.');
  }

  const newRoom = await roomService.create({ name });

  await roomService.emitUpdate();

  return res
    .status(201)
    .send(roomService.normalize(newRoom.dataValues));
}

/** @type {TyRoomController} */
export async function patch(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    throw ApiError.BadRequest();
  }

  const room = await roomService.getById(id);

  if (!room) {
    throw ApiError.NotFound('Room doesn\'t exists');
  }

  room.name = name;
  room.save();

  await roomService.emitUpdate();

  res.send(roomService.normalize(room));
}

/** @type {TyRoomController} */
export async function remove(req, res) {
  const { id } = req.params;

  console.info(`
  id = ${id}
  `);

  if (!id) {
    throw ApiError.BadRequest();
  }

  const room = await roomService.getById(id);

  if (!room) {
    throw ApiError.NotFound();
  }

  const result = await roomService.remove(room);

  await roomService.emitUpdate();

  res.status(200)
    .send(result);
}
