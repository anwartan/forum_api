const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const payload = {
      content: 'secret',
    };
    const credential = {
      id: '123',
    };
    const params = {
      id: '321',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      owner: credential.id,
      content: payload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addCommentUseCase = await getCommentUseCase.execute(payload, credential, params);

    expect(addCommentUseCase).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.getThread).toBeCalledWith(params.id);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({ content: payload.content, owner: credential.id, threadId: params.id }),
    );
  });
});
