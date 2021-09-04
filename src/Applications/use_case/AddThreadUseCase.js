const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, credential) {
    const { title, body } = payload;
    const userId = credential.id;
    const newThread = new NewThread({ owner: userId, title, body });
    return this._threadRepository.addThread(
      newThread,
    );
  }
}

module.exports = AddThreadUseCase;
