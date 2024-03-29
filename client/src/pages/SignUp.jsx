import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from '../components/OAuth';

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    console.log(e.target.value);
  };

  console.log(formData);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if(data.success === false){
       setErrorMessage(data.message)
      }

      setLoading(false)
      navigate('/sign-in');

      console.log(data)
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
    
  }

  console.log(errorMessage)

  return (
    <div className='min-h-screen mt-20'>
     <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5">
{/* left side */}
   <div className="flex-1">
    <Link to="/" className="bold dark:text-white text-4xl">
      <span className='px-2 py-1 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-700 rounded-lg text-white'>Arjun's</span>
      Blog
    </Link>
    <p className='text-sm mt-5 '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, ab ducimus rerum doloremque nam quaerat.</p>
   </div>

{/* right side */}
<div className="flex-1">
<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
  <div className="">
    <Label value='Your username' />
    <TextInput onChange={handleChange} type='text' placeholder='Username' id='username' />
  </div>

  <div className="">
    <Label value='Your email' />
    <TextInput onChange={handleChange} type='email' placeholder='name@company.com' id='email' />
  </div>

  <div className="">
    <Label value='Your password' />
    <TextInput onChange={handleChange} type='password' placeholder='password' id='password' />
  </div>

  <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
    {loading ? (
     <>
      <Spinner  size='sm'/>
      <span className='pl-3'>Loading...</span>
     </>
    ) : "Sign Up"}
    </Button>
    <OAuth />
</form>
<div className="flex gap-2 text-sm mt-5">
  <span>Have an account?</span>
  <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
</div>
{
  errorMessage && (
    <Alert className='mt-5' color='failure'>
      {errorMessage}
    </Alert>
  )
}
</div>
     </div>
    </div>
  )
}

export default SignUp