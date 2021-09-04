class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, owner, id,
    } = payload;

    this.content = content;
    this.owner = owner;
    this.id = id;
  }

  _verifyPayload({
    content, owner, id,
  }) {
    if (!content || !owner || !id) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof content !== 'string' || typeof id !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
