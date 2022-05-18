import { Button, Flex, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import router from 'next/router'

import InputField from '../components/InputField'
import Layout from '../components/Layout'
import { CreatePostInput, useCreatePostMutation } from '../generated/graphql'
import { useCheckAuth } from '../utils/useCheckAuth'

const CreatePost = () => {
  const {data: authData, loading: authLoading} = useCheckAuth()

  const [createPost] = useCreatePostMutation()

  const initialValues = {
    title: '',
    text: '',
  }

  const handleSubmit = async (values: CreatePostInput) => {
    await createPost({
      variables: {createPostInput: values},
      update(cache, {data}) {
        cache.modify({
          fields: {
            getAllPosts(existing) {
              console.log('CREATE POST [EXISTING]', existing)

              if (data?.createPost.success && data.createPost.post) {
                // Post: new_id
                const newPostRef = cache.identify(data.createPost.post)
                console.log('NEW POST REF', newPostRef)

                const newPostAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedPosts: [
                    {__ref: newPostRef},
                    ...existing.paginatedPosts // [{__ref: 'Post: 1'}, {__ref: 'Post: 2'}]
                  ]
                }
                console.log('NEW POST AFTER CREATION', newPostAfterCreation)

                return newPostAfterCreation
              }
            }
          }
        })
      }
    })
    router.push('/')
  }

  if (authLoading || (!authLoading && !authData?.isLogin)) {
    return (
      <Flex justifyContent='center' alignItems='center' minH='100vh'>
        <Spinner />
      </Flex>
    )
  } else {
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
                    Upload
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
}

export default CreatePost