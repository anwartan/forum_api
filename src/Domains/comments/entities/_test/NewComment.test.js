const messages = require('../../../../Utils/messages');
const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(messages['COMMENT.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'dicoding', owner: 'owner', threadId: 123,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(messages['COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding', owner: 'owner', threadId: 'thread-123',
    };

    // Action
    const comment = new NewComment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.threadId).toEqual(payload.threadId);
  });
});
