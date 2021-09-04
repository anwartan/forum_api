const messages = require('../../../../Utils/messages');
const AddedComment = require('../AddedComment');

describe('a AddedComment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(messages['COMMENT.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: 'dicoding',
      content: {},
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(messages['COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });
  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'dicoding',
      content: 'Dicoding Indonesia',
    };

    // Action
    const comment = new AddedComment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.content).toEqual(payload.content);
  });
});
