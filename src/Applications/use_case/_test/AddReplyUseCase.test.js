const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const payload = {
      content: 'secret',
    };

    const credential = {
      id: '123',
    };
    const params = {
      idComment: '321',
      idThread: '123',
    };
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      owner: credential.id,
      content: payload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    const getCommentUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    const addCommentUseCase = await getCommentUseCase.execute(payload, credential, params);

    expect(addCommentUseCase).toStrictEqual(expectedAddedReply);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(params.idComment);
    expect(mockThreadRepository.getThread).toBeCalledWith(params.idThread);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: payload.content,
        owner: credential.id,
        threadId: params.idThread,
        commentId: params.idComment,
      }),
    );
  });
});
