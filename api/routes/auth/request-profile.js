const omit = require('lodash/omit');

const action = 'request-profile';

module.exports = {
  action,
  claims: {
    profile: () => ({
      description: 'Please provide your full profile',
      fields: ['fullName', 'email', 'phone', 'signature', 'avatar', 'birthday'],
    }),
  },

  onAuth: ({ userDid, userPk, claims, updateSession }) => {
    const claim = claims.find((x) => x.type === 'profile');
    updateSession({
      result: {
        ...omit(claim, ['type', 'signature']),
        did: userDid,
        pk: userPk,
      },
    });
  },
};
