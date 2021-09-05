const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({
    owner, content, threadId, commentId,
  }) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date();
    const query = {
      text: 'INSERT INTO replies VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,content,owner',
      values: [id, content, owner, threadId, commentId, 0, createdAt, createdAt],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyById(replyId) {
    const query = {
      text: 'SELECT a.id, a.content, b.username, a.created_at,a.is_delete FROM replies as a inner join users as b on a.owner=b.id WHERE a.id = $1 ORDER BY a.created_at',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply not found');
    }
    return new Reply({ ...result.rows[0] });
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT a.id, a.content, b.username, a.created_at,a.is_delete FROM replies as a inner join users as b on a.owner=b.id WHERE a.comment_id = $1 ORDER BY a.created_at',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new Reply({ ...row }));
  }

  async deleteReply(id, threadId, commentId) {
    const query = {
      text: 'UPDATE replies SET is_delete=1 WHERE id = $1 and thread_id = $2 and comment_id = $3',
      values: [id, threadId, commentId],
    };
    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
