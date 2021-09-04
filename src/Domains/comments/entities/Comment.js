class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, username, created_at, is_delete,
    } = payload;

    this.content = is_delete === 1 ? '**komentar telah dihapus**' : content;
    this.username = username;
    this.id = id;
    this.date = created_at;
  }

  _verifyPayload({
    content, username, id, created_at, is_delete,
  }) {
    if (!content || !username || !id || !created_at) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof content !== 'string' || typeof id !== 'string' || typeof created_at !== 'string' || typeof is_delete !== 'number') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
