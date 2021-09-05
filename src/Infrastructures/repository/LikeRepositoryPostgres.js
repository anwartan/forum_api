const LikeRepository = require('../../Domains/likes/LikeRepository');
const Like = require('../../Domains/likes/entities/Like');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike({
    owner, commentId, isLike,
  }) {
    const id = `like-${this._idGenerator()}`;
    const createdAt = new Date();
    const query = {
      text: 'INSERT INTO likes VALUES ($1,$2,$3,$4,$5,$6) RETURNING owner,comment_id as commentId,is_like as isLike',
      values: [id, owner, commentId, isLike, createdAt, createdAt],
    };
    const result = await this._pool.query(query);
    return new Like({
      owner: result.rows[0].owner,
      commentId: result.rows[0].commentid,
      isLike: result.rows[0].islike,
    });
  }

  async getLike(owner, comment_id) {
    const query = {
      text: 'SELECT owner,comment_id as commentId, is_like as isLike FROM likes WHERE owner=$1 and comment_id=$2',
      values: [owner, comment_id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return new Like({
      owner: result.rows[0].owner,
      commentId: result.rows[0].commentid,
      isLike: result.rows[0].islike,
    });
  }

  async getLikes(commentId) {
    const query = {
      text: 'SELECT owner,comment_id as commentId, is_like as isLike FROM likes WHERE comment_id=$1 and is_like=1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new Like({
      owner: row.owner,
      commentId: row.commentid,
      isLike: row.islike,
    }));
  }

  async updateLike(owner, comment_id, like) {
    const query = {
      text: 'UPDATE likes SET is_like=$1 WHERE comment_id = $2 and owner = $3',
      values: [like, comment_id, owner],
    };
    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
