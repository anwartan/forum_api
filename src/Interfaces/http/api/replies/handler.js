class RepliesHandler {
  constructor({ addReplyUseCase, deleteReplyUseCase }) {
    this._addReplyUseCase = addReplyUseCase;
    this._deleteReplyUseCase = deleteReplyUseCase;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addedReply = await this._addReplyUseCase.execute(
      request.payload, request.auth.credentials, request.params,
    );
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    await this._deleteReplyUseCase.execute(
      request.payload, request.auth.credentials, request.params,
    );
    const response = h.response({
      status: 'success',

    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
