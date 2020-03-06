export type TPassword = string
export type TEmail = string
export type TPhone = string
export type TMoid = Buffer // MongoDb ObjectId
export type TToken = Buffer
export type TErrorCode = number
export type TErrorInfo = [TErrorCode, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?]

export type TDate = number;
export type TDateTime = number;
export type TTime = number;

export type TEnum = number;

export type TCurrencyValue = number;
export type TCurrencyName = TEnum;
export type TCurrency = [TCurrencyValue, TCurrencyName]