import { LexResponse } from '../../types/lex';

export const buildSuccessfulResponse = (message: string): LexResponse => ({
  sessionAttributes: {},
  dialogAction: {
    type: 'Close',
    fulfillmentState: 'Fulfilled',
    message: {
      contentType: 'PlainText',
      content: message
    }
  }
});

export const buildErrorResponse = (message: string): LexResponse => ({
  sessionAttributes: {},
  dialogAction: {
    type: 'Close',
    fulfillmentState: 'Failed',
    message: {
      contentType: 'PlainText',
      content: message
    }
  }
});
