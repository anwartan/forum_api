class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload, credential, params) {
    const { id } = params;
    const thread = await this._threadRepository.getThread(id);
    const comment = await this._commentRepository.getCommentByThreadId(id);

    await Promise.all(comment.map(async (element, index) => {
      const replies = await this._replyRepository.getReplyByCommentId(element.id);

      comment[index].replies = replies;
    }));
    thread.comments = comment;
    return thread;
  }
}

module.exports = GetThreadUseCase;
