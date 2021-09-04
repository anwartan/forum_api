const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._idGenerator = idGenerator;
    this._pool = pool;
  }

  async addComment({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO comments VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,content,owner',
      values: [id, content, owner, threadId, 0, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId, threadId) {
    const query = {
      text: 'UPDATE comments SET is_delete=1 WHERE id = $1 and thread_id = $2',
      values: [commentId, threadId],
    };
    await this._pool.query(query);
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT a.id, a.content, b.username, a.created_at,a.is_delete FROM comments as a inner join users as b on a.owner=b.id WHERE a.thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new Comment({ ...row }));
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT a.id, a.content, b.username, a.created_at,a.is_delete FROM comments as a inner join users as b on a.owner=b.id WHERE a.id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Comment not found');
    }
    return new Comment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
