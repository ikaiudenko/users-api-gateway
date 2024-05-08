export const US_QUEUE = 'USER_SERVICE_QUEUE';
export const US_NAME = 'MAIL_SERVICE';
export const enum US_EVENTS {
  Create = 'USER_CREATE',
  Get = 'USER_GET',
  GetAvatar = 'USER_GET_AVATAR',
  DeleteAvatar = 'USER_DELETE_AVATAR',
}

export const MS_QUEUE = 'MAIL_SERVICE_QUEUE';
export const MS_NAME = 'MAIL_SERVICE'
export const enum MS_EVENTS {
  SendEmail = 'SEND_EMAIL',
}