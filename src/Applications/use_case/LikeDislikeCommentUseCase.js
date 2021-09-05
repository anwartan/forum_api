const Like = require('../../Domains/likes/entities/Like');

class LikeDislikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, credential, params) {
    const { id, idComment } = params;
    const userId = credential.id;
    await this._threadRepository.getThread(id);
    await this._commentRepository.getCommentById(idComment);

    const like = await this._likeRepository.getLike(userId, idComment);
    if (like != null) {
      let isLike;
      if (like.isLike === 1) {
        isLike = 0;
      } else {
        isLike = 1;
      }
      const newLike = new Like({ owner: like.owner, commentId: like.commentId, isLike });
      await this._likeRepository.updateLike(newLike.owner, newLike.commentId, newLike.isLike);
    } else {
      const newLike = new Like({ owner: userId, commentId: idComment, isLike: 1 });
      await this._likeRepository.addLike({
        owner: newLike.owner, commentId: newLike.commentId, isLike: newLike.isLike,
      });
    }
  }
}

module.exports = LikeDislikeCommentUseCase;
