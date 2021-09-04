class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, owner, title,
    } = payload;

    this.owner = owner;
    this.title = title;
    this.id = id;
  }

  _verifyPayload({
    owner, title, id,
  }) {
    if (!owner || !title || !id) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof title !== 'string' || typeof id !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
