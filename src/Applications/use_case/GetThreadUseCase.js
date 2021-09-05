class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(payload, credential, params) {
    const { id } = params;
    const thread = await this._threadRepository.getThread(id);
    const comment = await this._commentRepository.getCommentByThreadId(id);

    await Promise.all(comment.map(async (element, index) => {
      comment[index].replies = await this._replyRepository.getReplyByCommentId(element.id);
      comment[index].likeCount = (await this._likeRepository.getLikes(element.id)).length;
    }));
    thread.comments = comment;
    return thread;
  }
}

module.exports = GetThreadUseCase;
