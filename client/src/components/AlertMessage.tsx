import { Alert, AlertIcon, AlertTitle, Button } from '@chakra-ui/react'
import Layout from './Layout'
import NextLink from 'next/link'

interface AlertMessageProps {
  message: string
}

const AlertMessage = ({ message }: AlertMessageProps) => {
  return (
    <Layout>
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>{message}</AlertTitle>
        </Alert>

        <NextLink href='/'>
          <Button mt={4}>Back to Homepage</Button>
        </NextLink>
      </Layout>
  )
}

export default AlertMessage