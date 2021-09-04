/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', owner = 'dicoding', content = 'Dicoding Indonesia', threadId = 'thread-123', commentId = 'comment-123',
  }) {
    const created = new Date();
    const query = {
      text: 'INSERT INTO replies VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      values: [id, content, owner, threadId, commentId, 0, created, created],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies ');
  },
};

module.exports = RepliesTableTestHelper;
