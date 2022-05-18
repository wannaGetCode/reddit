import React from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { Button, Flex, Spinner, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import {
	useRegisterMutation,
	RegisterInput,
	IsLoginQuery,
	IsLoginDocument
} from '../generated/graphql'
import { mapFieldErrors } from '../helper/mapFieldErrors'
import { useCheckAuth } from '../utils/useCheckAuth'
import Layout from '../components/Layout'

const Register = () => {
	const router = useRouter()
	const { data: authData, loading: authLoading } = useCheckAuth()
	const toast = useToast()

	const initialValues: RegisterInput = { username: '', email: '', password: '' }

	const [registerUser, { loading: _registerUserLoading, data, error }] =
		useRegisterMutation()

	const handleSubmit = async (
		values: RegisterInput,
		{ setErrors }: FormikHelpers<RegisterInput>
	) => {
		const response = await registerUser({
			variables: {
				registerInput: values
			},
			update(cache, { data }) {
				if (data?.register?.success) {
					cache.writeQuery<IsLoginQuery>({
						query: IsLoginDocument,
						data: { isLogin: data.register.user }
					})
				}
			}
		})

		if (response.data?.register?.errors) {
			setErrors(mapFieldErrors(response.data.register.errors))
		} else if (response.data?.register?.success) {
			toast({
				title: 'Registered successfully',
				description: `Welcome ${response.data.register.user?.username} to Reddit`,
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
					{error && <p>Failed to register. Internal server error</p>}

					{data && data.register?.success && (
						<p>Registered successfully {JSON.stringify(data)}</p>
					)}
					<Formik initialValues={initialValues} onSubmit={handleSubmit}>
						{({ isSubmitting }) => (
							<Form>
								<InputField
									placeholder="Enter username"
									name="username"
									label="Username"
									type="text"
								/>

								<InputField
									placeholder="Email"
									name="email"
									label="Email"
									type="email"
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
										Register
									</Button>

									<Button ml="auto">
										<NextLink href="/login">Back to login</NextLink>
									</Button>
								</Flex>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</Layout>
	)
}

export default Register
