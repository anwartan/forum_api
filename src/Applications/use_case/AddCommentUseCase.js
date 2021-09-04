const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, credential, params) {
    const { id } = params;
    const { content } = payload;
    const userId = credential.id;
    await this._threadRepository.getThread(id);
    const newComment = new NewComment({ content, owner: userId, threadId: id });
    return this._commentRepository.addComment(
      newComment,
    );
  }
}

module.exports = AddCommentUseCase;
