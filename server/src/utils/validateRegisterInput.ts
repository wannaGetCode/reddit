import { RegisterInput } from '../types/RegisterInput';

export const validateRegisterInput = (registerInput: RegisterInput) => {
  if (!registerInput.email.includes('@')) {
    return {
      message: 'Invalid email',
      errors: [
        {
          field: 'email',
          message: 'Email must include "@" symbol'
        }
      ]
    } 
  }

  if (registerInput.password.length <= 2) {
    return {
      message: 'Invalid password',
      errors: [
        {
          field: 'password',
          message: 'Password must be more than 2 characters'
        }
      ]
    } 
  }

  if (registerInput.username.length <= 2) {
    return {
      message: 'Invalid username',
      errors: [
        {
          field: 'username',
          message: 'Username must be more than 2 characters'
        }
      ]
    } 
  }

  if (registerInput.username.includes('@')) {
    return {
      message: 'Invalid username',
      errors: [
        {
          field: 'username',
          message: 'Username must not include "@" symbol'
        }
      ]
    }
  }

  return null
}