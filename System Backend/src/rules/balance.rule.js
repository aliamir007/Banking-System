import { ACCOUNT_STATUS } from '../constants/accountStatus.js';

export const checkAccountSafety = ({ senderAccount, receiverAccount }) => {
  const triggered = [];
  let block = false;

  if (senderAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    triggered.push('SENDER_ACCOUNT_NOT_ACTIVE');
    block = true;
  }

  if (receiverAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    triggered.push('RECEIVER_ACCOUNT_NOT_ACTIVE');
    block = true;
  }

  return { triggered, block };
};