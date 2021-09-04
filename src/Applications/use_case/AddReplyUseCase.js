const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload, credential, params) {
    const { idThread, idComment } = params;
    const { content } = payload;
    const userId = credential.id;
    const newReply = new NewReply({
      content, owner: userId, threadId: idThread, commentId: idComment,
    });
    await this._threadRepository.getThread(idThread);
    await this._commentRepository.getCommentById(idComment);

    return this._replyRepository.addReply(
      newReply,
    );
  }
}

module.exports = AddReplyUseCase;
