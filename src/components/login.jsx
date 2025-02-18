import React, {useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import Error from './error';
import *as Yup from 'yup'
import useFetch from '@/hooks/use-fetch';
import { login } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/context';


const Login = () => {

  const [errors,setErrors] = useState([])
  const [formData,setFromData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  let [searchParams] =useSearchParams()
  const longLink = searchParams.get('createNew')

  const{data, error, loading, fn:fnLogin}=useFetch(login,formData)
    const { fetchUser } = UrlState();


  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
      fetchUser()
    }
    
  }, [data,error])
  
   
  const handleInputChange = (e) => {
    const {name,value} = e.target
    setFromData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    setErrors([])
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
        password: Yup.string()
        .min(6,'Password must be at least 6 characters')
        .required('Password is required'),
      })

      await schema.validate(formData,{abortEarly: false})
      await fnLogin()
      //api call
    } catch (e) {
      const newErrors = {}

      e?.inner.forEach((err) => {
        newErrors[err.path] = err.message
      })

      setErrors(newErrors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
      </CardContent>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white rounded py-2"
        >
          {loading ? <BeatLoader color="#36d7d7" size={10} /> : "Login"}
        </button>
      </CardFooter>
    </Card>
  );
}

export default Login