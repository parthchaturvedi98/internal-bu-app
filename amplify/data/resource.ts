import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Account: a.model({
    name:        a.string().required(),
    company:     a.string().required(),
    status:      a.enum(['active', 'on_hold', 'closed', 'won', 'lost']),
    ownerName:   a.string().required(),
    ownerEmail:  a.string().required(),
    description: a.string(),
    entries:     a.hasMany('TimelineEntry', 'accountId'),
  }).authorization(allow => [allow.publicApiKey()]),

  TimelineEntry: a.model({
    accountId:  a.id().required(),
    account:    a.belongsTo('Account', 'accountId'),
    entryDate:  a.date().required(),
    title:      a.string().required(),
    notes:      a.string(),
  }).authorization(allow => [allow.publicApiKey()]),
});

export type Schema = typeof schema;

export default defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
