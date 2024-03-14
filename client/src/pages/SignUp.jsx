import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Label, TextInput } from 'flowbite-react';

function SignUp() {
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
<form className='flex flex-col gap-4'>
  <div className="">
    <Label value='Your username' />
    <TextInput type='text' placeholder='Username' id='username' />
  </div>

  <div className="">
    <Label value='Your email' />
    <TextInput type='text' placeholder='name@company.com' id='email' />
  </div>

  <div className="">
    <Label value='Your password' />
    <TextInput type='text' placeholder='password' id='password' />
  </div>

  <Button gradientDuoTone='purpleToPink' type='submit'>
    Sign Up
    </Button>
</form>
<div className="flex gap-2 text-sm mt-5">
  <span>Have an account?</span>
  <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
</div>
</div>
     </div>
    </div>
  )
}

export default SignUp