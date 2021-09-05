const NewUser = require('../../../Domains/users/entities/NewUser');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const EncryptionHelper = require('../../security/EncryptionHelper');
const GetThreadUseCase = require('../GetThreadUseCase');
const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');
const Like = require('../../../Domains/likes/entities/Like');

describe('getThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const payload = {

    };

    const credential = {

    };
    const params = {
      id: '123',
    };
    const expectedGetThread = new Thread({
      id: 'thread-123', username: 'anwar124', title: 'anwar123', body: 'content', created_at: '2021-08-22T13:52:54.016+07:00',
    });
    const expectedGetCommentByThreadId = [
      new Comment({
        id: 'comment-123', content: 'dicoding', username: 'anwar', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 1,
      }),
      new Comment({
        id: 'comment-124', content: 'dicoding', username: 'anwar', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 1,
      }),
      new Comment({
        id: 'comment-125', content: 'dicoding', username: 'anwar', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 0,
      }),
    ];

    const expectedGetLikeByCommentId = [
      new Like({
        owner: 'anwar', commentId: 'comment-123', isLike: 1,
      }),
    ];
    const expectedGetReplyByCommentId = [
      new Reply({
        content: 'dicoding', username: 'anwar', id: 'reply-123', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 0,
      }),
    ];

    const expectedThread = expectedGetThread;
    expectedGetCommentByThreadId[0].replies = expectedGetReplyByCommentId;
    expectedGetThread.comments = expectedGetCommentByThreadId;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn(() => Promise.resolve(expectedGetThread));
    mockLikeRepository.getLikes = jest.fn(() => Promise.resolve(expectedGetLikeByCommentId));
    mockCommentRepository.getCommentByThreadId = jest.fn(
      () => Promise.resolve(expectedGetCommentByThreadId),
    );
    mockThreadRepository.getThread = jest.fn(() => Promise.resolve(expectedGetThread));
    mockReplyRepository.getReplyByCommentId = jest.fn(
      () => Promise.resolve(expectedGetReplyByCommentId),
    );
    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute(payload, credential, params);

    expect(thread).toStrictEqual(expectedThread);

    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(params.id);
    expect(mockReplyRepository.getReplyByCommentId)
      .toHaveBeenCalledWith(expectedGetCommentByThreadId[0].id);
    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(params.id);
    expect(mockLikeRepository.getLikes)
      .toHaveBeenCalledWith(expectedGetCommentByThreadId[0].id);
  });
});
