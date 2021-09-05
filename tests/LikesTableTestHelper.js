/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addLike({
    id = 'like-123', owner = 'dicoding', commentId = 'Dicoding Indonesia', isLike = 0,
  }) {
    const created = new Date();
    const query = {
      text: 'INSERT INTO likes VALUES ($1,$2,$3,$4,$5,$6)',
      values: [id, owner, commentId, isLike, created, created],
    };

    await pool.query(query);
  },

  async findLikesById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes ');
  },
};

module.exports = RepliesTableTestHelper;
