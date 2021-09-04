const messages = require('../../../../Utils/messages');
const NewThread = require('../NewThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'dicoding', title: 'dicoding',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(messages['THREAD.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123, body: 'dicoding', title: 'dicoding',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(messages['THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123', body: 'dicoding', title: 'dicoding',
    };

    // Action
    const comment = new NewThread(payload);

    // Assert
    expect(comment.body).toEqual(payload.body);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.title).toEqual(payload.title);
  });
});
