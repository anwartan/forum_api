class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, username, id, created_at, is_delete,
    } = payload;
    this.date = created_at;
    this.content = is_delete === 1 ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.id = id;
  }

  _verifyPayload({
    content, username, id, created_at,
  }) {
    if (!content || !username || !id || !created_at) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof content !== 'string' || typeof id !== 'string' || typeof created_at !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
