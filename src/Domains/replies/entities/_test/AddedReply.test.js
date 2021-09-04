const messages = require('../../../../Utils/messages');
const AddedReply = require('../AddedReply');

describe('a AddedComment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    expect(() => new AddedReply(payload)).toThrowError(messages['REPLY.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      owner: 'dicoding',
      content: {},
    };

    expect(() => new AddedReply(payload)).toThrowError(messages['REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });
  it('should create newReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      owner: 'dicoding',
      content: 'Dicoding Indonesia',
    };

    const reply = new AddedReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.owner).toEqual(payload.owner);
    expect(reply.content).toEqual(payload.content);
  });
});
