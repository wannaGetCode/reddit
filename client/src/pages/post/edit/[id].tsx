import { Button, Flex, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import AlertMessage from '../../../components/AlertMessage'
import InputField from '../../../components/InputField'
import Layout from '../../../components/Layout'
import { UpdatePostInput, useGetPostByIdQuery, useIsLoginQuery, useUpdatePostMutation } from '../../../generated/graphql'


const PostEdit = () => {
  const router = useRouter()
  const postId = router.query.id as string

  const {data: isLoginData, loading: isLoginLoading} = useIsLoginQuery()

  const {data: postData, loading: postLoading} = useGetPostByIdQuery({
    variables: {id: postId}
  })

  const [updatePost] = useUpdatePostMutation()

  if (isLoginLoading || postLoading) {
    return (
      <Flex justifyContent='center' alignItems='center' minH='100vh'>
        <Spinner />
      </Flex>
    )
  }

  if (!postData?.getPostById) {
    return <AlertMessage message='Post not found' />
  }

  if (isLoginData?.isLogin?.id !== postData?.getPostById?.userId.toString()) {
    return <AlertMessage message='Unauthorised' />
  }

  const initialValues = {
    title: postData.getPostById.title,
    text: postData.getPostById.text
  }

  const handleSubmit = async (values: Omit<UpdatePostInput, 'id'>) => {
    await updatePost({
      variables: {updatePostInput: {
        ...values,
        id: postId,
      }}
    })
    router.back()
  }

  return (
    <Layout>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder='Title of your post'
              name='title'
              label='Title'
              type='text'
            />

            <InputField
              placeholder='Post content'
              name='text'
              label='Post content'
              type='textarea'
            />
          
            <Flex
              mt={4}
              justifyContent='space-between'
              alignItems='center'                  
            >
              <Button
                type='submit'
                colorScheme='teal'
                isLoading={isSubmitting}
              >
                Update
              </Button>

              <NextLink href='/'>
                <Button colorScheme='red'>Cancel</Button>
              </NextLink>
            
            </Flex>            
          </Form>
        )}    
      </Formik>
    </Layout>
  )
}

export default PostEdit