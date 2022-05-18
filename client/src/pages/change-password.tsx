import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import NextLink from 'next/link'
import router, { useRouter } from 'next/router'
import React, { useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { ChangePasswordInput, useChangePasswordMutation } from '../generated/graphql'
import { mapFieldErrors } from '../helper/mapFieldErrors'
import { useCheckAuth } from '../utils/useCheckAuth'


const ChangePassword = () => {
  const {query} = useRouter()
  const initialValues = {newPassword: ''}
  const [changePassord] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  const {data: authData, loading: authLoading} = useCheckAuth()

  const handleSubmit = async (values: ChangePasswordInput, {setErrors}: FormikHelpers<ChangePasswordInput>) => {
    if (query.userId && query.token) {
      const response = await changePassord({
        variables: {
          userId: query.userId as string,
          token: query.token as string,
          changePasswordInput: values
        } 
      })

      if (response.data?.changePassword.errors) {
        const fieldErrors = mapFieldErrors(response.data.changePassword.errors)
        if ('token' in fieldErrors) {
          setTokenError(fieldErrors.token)
        }
        setErrors(fieldErrors)
      } else if (response.data?.changePassword.user) {
        router.push('/login')
      }
    }   
  }

  if (authLoading || (!authLoading && authData?.isLogin)) {
    return (
      <Flex justifyContent='center' alignItems='center' minH='100vh'>
        <Spinner />
      </Flex>
    )
  } else if (!query.token || !query.userId) {
    return <AlertMessage message='Invalid password change request' />
  } else {
    return (
      <Wrapper>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                placeholder='Enter your new password'
                name='newPassword'
                label='New Password'
                type='password'
              />
              {tokenError && (
                <>
                  <Box color='red'>{tokenError}</Box>
                  <NextLink href='/forgot-password'>
                    <Link>Go back to change password</Link>
                  </NextLink>
                </>
              )}
              
              <Flex mt={4}>                
                <Button
                  type='submit'
                  colorScheme='teal'
                  isLoading={isSubmitting}
                >
                  Change password
                </Button>

                <Button ml='auto'>
                  <NextLink href='/login'>
                    Back to login
                  </NextLink>
                </Button>
              </Flex> 
            </Form>
          )}    
        </Formik>
      </Wrapper>
    )
  }
}

export default ChangePassword