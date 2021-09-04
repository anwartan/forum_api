const messages = require('../../../../Utils/messages');
const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding', title: 'dicoding', body: 'backend dicoding',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(messages['THREAD.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, username: 'dicoding', title: 'dicoding', body: 'dicoding', created_at: '2021-08-22T13:52:54.016+07:00',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(messages['THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123', username: 'dicoding', title: 'dicoding', body: 'dicoding', created_at: '2021-08-22T13:52:54.016+07:00',
    };

    // Action
    const comment = new Thread(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.title).toEqual(payload.title);
    expect(comment.body).toEqual(payload.body);
    expect(comment.date).toEqual(payload.created_at);
  });
});
