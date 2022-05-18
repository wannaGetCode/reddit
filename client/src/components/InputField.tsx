import React from 'react'
import { useField } from 'formik'
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react'

interface InputFieldProps {
  name: string
  label: string
  placeholder: string
  type: string
}

const InputField = (props: InputFieldProps) => {
  const [field, {error}] = useField(props)

  return (
    <FormControl mt={4} isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {props.type === 'textarea' ? (
				<Textarea {...field} id={field.name} {...props} />
			) : (
				<Input {...field} id={field.name} {...props} />
			)}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField