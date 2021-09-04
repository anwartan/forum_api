const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if username is not equal', async () => {
    const params = {
      id: 'thread-123',
      idComment: 'comment-123',

    };
    const credential = {
      username: 'admin',
    };
    const payload = {};
    const expectedGetCommentById = new Comment({
      id: 'comment-123',
      content: 'dicoding',
      username: 'user-123123',
      created_at: '2021-08-22T13:52:54.016+07:00',
      is_delete: 0,
    });
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentById));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(payload, credential, params))
      .rejects
      .toThrowError('Kamu tidak dapat akses');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const params = {
      id: 'thread-123',
      idComment: 'comment-123',

    };
    const credential = {

      username: 'admin',
    };
    const payload = {};
    const expectedGetCommentById = new Comment({
      id: 'comment-123',
      content: 'dicoding',
      username: credential.username,
      created_at: '2021-08-22T13:52:54.016+07:00',
      is_delete: 0,
    });
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetCommentById));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(payload, credential, params);

    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(params.idComment);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(params.idComment, params.id);
  });
});
