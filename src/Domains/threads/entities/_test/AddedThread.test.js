const messages = require('../../../../Utils/messages');
const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'dicoding', title: 'dicoding',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(messages['THREAD.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, owner: 'dicoding', title: 'dicoding',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(messages['THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123', owner: 'dicoding', title: 'dicoding',
    };

    // Action
    const comment = new AddedThread(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.title).toEqual(payload.title);
  });
});
