class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, title, body, created_at,
    } = payload;
    this.id = id;
    this.username = username;
    this.title = title;
    this.body = body;
    this.date = created_at;
  }

  _verifyPayload({
    id, username, title, body, created_at,
  }) {
    if (!username || !title || !body || !created_at || !id) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof created_at !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
