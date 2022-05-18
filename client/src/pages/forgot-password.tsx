import { Box, Button, Flex, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'

import InputField from '../components/InputField'
import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import { ForgotPasswordInput, useForgotPasswordMutation } from '../generated/graphql'
import { useCheckAuth } from '../utils/useCheckAuth'

const ForgotPassword = () => {
  const initialValues = {email: ''}

  const [forgotPassword, {loading, data}] = useForgotPasswordMutation()

  const {data: authData, loading: authLoading} = useCheckAuth()

  const handleSubmit = async (values: ForgotPasswordInput) => {
    await forgotPassword({variables: {forgotPasswordInput: values}})
  }
   
  if (authLoading || (!authLoading && authData?.isLogin)) {
    return (
      <Flex justifyContent='center' alignItems='center' minH='100vh'>
        <Spinner />
      </Flex>
    )
  } else {
    return (
      <Layout>
        <Wrapper>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => !loading && data ? <Box>Please check your mail inbox</Box> : (
              <Form>
                <InputField
                  placeholder='Enter your email'
                  name='email'
                  label='Email'
                  type='email'
                />

                <Flex mt={4}>                
                    <Button
                      type='submit'
                      colorScheme='teal'
                      isLoading={isSubmitting}
                    >
                      Send Reset Password Email
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
      </Layout>
    )
  }
}

export default ForgotPassword