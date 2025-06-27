import React from 'react'
import {
  Form,
  FormControl,
  FormDescription, 
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Controller, FieldValue, FieldValues, Path } from 'react-hook-form'  //provides third-party controlled components like Select, DatePicker, Slider, etc.


interface FormFieldProps<T extends FieldValues> {
    control: Control<T>; 
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'file ';
}

const FormField = ({control,name,label,placeholder,type="text"} : FormFieldProps<T> ) => (
    <Controller 
        name={name} 
        control={control} 
        render = {({ field }) => (
                    <FormItem>
                    <FormLabel className='label'>Username</FormLabel>
                    <FormControl>
                        <Input className='input' placeholder={placeholder} {...field}  type={type}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
    />
)

export default FormField
