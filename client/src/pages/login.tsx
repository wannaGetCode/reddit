import React from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { Button, Spinner, Flex, useToast, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { mapFieldErrors } from '../helper/mapFieldErrors'
import {
	IsLoginDocument,
	IsLoginQuery,
	LoginInput,
	useLoginMutation
} from '../generated/graphql'
import { useCheckAuth } from '../utils/useCheckAuth'
import Layout from '../components/Layout'

const Login = () => {
	const router = useRouter()
	const initialValues: LoginInput = { usernameOrEmail: '', password: '' }
	const { data: authData, loading: authLoading } = useCheckAuth()
	const toast = useToast()

	const [loginUser, { loading: _loginUserLoading, error }] = useLoginMutation()

	const handleSubmit = async (
		values: LoginInput,
		{ setErrors }: FormikHelpers<LoginInput>
	) => {
		const response = await loginUser({
			variables: {
				loginInput: values
			},
			update(cache, { data }) {
				if (data?.login.success) {
					cache.writeQuery<IsLoginQuery>({
						query: IsLoginDocument,
						data: { isLogin: data.login.user }
					})
				}
			}
		})

		if (response.data?.login?.errors) {
			setErrors(mapFieldErrors(response.data.login.errors))
		} else if (response.data?.login?.success) {
			toast({
				title: 'Logged in successfully',
				description: `Welcome ${response.data.login.user?.username} to Reddit`,
				status: 'success',
				duration: 3000,
				isClosable: true
			})

			router.push('/')
		}
	}

	return (
		<Layout>
			{authLoading || (!authLoading && authData?.isLogin) ? (
				<Flex justifyContent="center" alignItems="center" minH="100vh">
					<Spinner />
				</Flex>
			) : (
				<Wrapper>
					{error && <p>Failed to login. Internal server error</p>}
					<Formik initialValues={initialValues} onSubmit={handleSubmit}>
						{({ isSubmitting }) => (
							<Form>
								<InputField
									placeholder="Enter your username or email"
									name="usernameOrEmail"
									label="Username"
									type="text"
								/>

								<InputField
									placeholder="Password"
									name="password"
									label="Password"
									type="password"
								/>

								<Flex mt={4}>
									<Button
										type="submit"
										colorScheme="teal"
										isLoading={isSubmitting}
									>
										Login
									</Button>

									<NextLink href="/forgot-password">
										<Link ml="auto">Forgot Password?</Link>
									</NextLink>
								</Flex>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</Layout>
	)
}

export default Login
