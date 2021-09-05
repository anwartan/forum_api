class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner, commentId, isLike,
    } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.isLike = isLike;
  }

  _verifyPayload({
    owner, commentId, isLike,
  }) {
    if (!owner || !commentId) {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof commentId !== 'string' || typeof isLike !== 'number') {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLike;
