const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload, credential, params) {
    const { id, idComment } = params;
    const { username } = credential;
    const comment = await this._commentRepository.getCommentById(idComment);
    if (comment.username !== username) {
      throw new AuthorizationError('Kamu tidak dapat akses');
    }
    await this._commentRepository.deleteComment(
      idComment, id,
    );
  }
}

module.exports = DeleteCommentUseCase;
