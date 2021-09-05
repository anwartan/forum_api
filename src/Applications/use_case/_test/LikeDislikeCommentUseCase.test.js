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
const LikeDislikeCommentUseCase = require('../LikeDislikeCommentUseCase');

describe('LikeDislikeCommentUseCase', () => {
  it('should orchestrating the dislike to like action correctly', async () => {
    const payload = {

    };

    const credential = {
      id: 'user-123',
    };
    const params = {
      id: 'thread-123',
      idComment: 'comment-123',
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

    const expectedGetLikeByCommentId = new Like({
      owner: 'user-123', commentId: 'comment-123', isLike: 1,
    });
    const expectedDislike = new Like({
      owner: 'user-123', commentId: 'comment-123', isLike: 0,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentByThreadId));

    mockLikeRepository.getLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetLikeByCommentId));
    mockLikeRepository.updateLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDislike));
    const likeDislikeCommentUseCase = new LikeDislikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    await likeDislikeCommentUseCase.execute(payload, credential, params);

    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(params.id);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(params.idComment);
    expect(mockLikeRepository.getLike)
      .toHaveBeenCalledWith(credential.id, params.idComment);
    expect(mockLikeRepository.updateLike)
      .toHaveBeenCalled(
        expectedGetCommentByThreadId[0].owner, expectedGetCommentByThreadId[0].commentId, 0,
      );
  });
  it('should orchestrating the like to dislike action correctly', async () => {
    const payload = {

    };

    const credential = {
      id: 'user-123',
    };
    const params = {
      id: 'thread-123',
      idComment: 'comment-123',
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

    const expectedGetLikeByCommentId = new Like({
      owner: 'user-123', commentId: 'comment-123', isLike: 0,
    });
    const expectedLike = new Like({
      owner: 'user-123', commentId: 'comment-123', isLike: 1,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentByThreadId));

    mockLikeRepository.getLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetLikeByCommentId));
    mockLikeRepository.updateLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedLike));
    const likeDislikeCommentUseCase = new LikeDislikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    await likeDislikeCommentUseCase.execute(payload, credential, params);

    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(params.id);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(params.idComment);
    expect(mockLikeRepository.getLike)
      .toHaveBeenCalledWith(credential.id, params.idComment);
    expect(mockLikeRepository.updateLike)
      .toHaveBeenCalled(
        expectedGetCommentByThreadId[0].owner, expectedGetCommentByThreadId[0].commentId, 1,
      );
  });

  it('should orchestrating the like action correctly', async () => {
    const payload = {

    };

    const credential = {
      id: 'user-123',
    };
    const params = {
      id: 'thread-123',
      idComment: 'comment-123',
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

    const expectedGetLikeByCommentId = null;
    const expectedLike = new Like({
      owner: credential.id, commentId: params.idComment, isLike: 1,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentByThreadId));

    mockLikeRepository.getLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetLikeByCommentId));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedLike));
    const likeDislikeCommentUseCase = new LikeDislikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    await likeDislikeCommentUseCase.execute(payload, credential, params);

    expect(mockThreadRepository.getThread)
      .toHaveBeenCalledWith(params.id);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(params.idComment);
    expect(mockLikeRepository.getLike)
      .toHaveBeenCalledWith(credential.id, params.idComment);
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(
        { owner: 'user-123', commentId: 'comment-123', isLike: 1 },
      );
  });
});
