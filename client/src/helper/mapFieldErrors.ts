// [
//   {
//     field: 'username',
//     message: 'some error'
//   }
// ]

import { FieldError } from '../generated/graphql';

export const mapFieldErrors = (errors: FieldError[]): {[key: string]: any} => {
  return errors.reduce((accumErrObj, error) => ({
    ...accumErrObj,
    [error.field]: error.message
  }), {})
}