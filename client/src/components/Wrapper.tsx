import React, { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

type WrapperSize = 'regular' | 'small'

interface IWrapperProps {
  children: ReactNode,
  size?: WrapperSize
}

const Wrapper = ({ children, size = 'small' }: IWrapperProps) => {
  return (
    <Box maxW={size === 'regular' ? '800px' : '400px'} w='100%' mt={8} mx='auto' minHeight='76vh'>
      {children}
    </Box>
  )
}

export default Wrapper