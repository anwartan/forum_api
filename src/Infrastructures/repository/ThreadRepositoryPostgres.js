const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ owner, title, body }) {
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,title,owner',
      values: [id, title, body, owner, createdAt, createdAt],
    };
    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThread(id) {
    const query = {
      text: 'SELECT a.id,a.title,a.body,b.username,a.created_at FROM threads as a inner join users as b on a.owner=b.id WHERE a.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread not found');
    }
    return new Thread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
