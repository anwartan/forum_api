const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(payload, credential, params) {
    const { idThread, idComment, idReply } = params;
    const { username } = credential;
    const reply = await this._replyRepository.getReplyById(idReply);
    if (reply.username !== username) {
      throw new AuthorizationError('Kamu tidak dapat akses');
    }
    await this._replyRepository.deleteReply(
      idReply, idThread, idComment,
    );
  }
}

module.exports = DeleteReplyUseCase;
