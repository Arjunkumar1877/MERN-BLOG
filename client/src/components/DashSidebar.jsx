import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
function DashSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams)
    const tabFormUrl = urlParams.get('tab');
    console.log(tabFormUrl)

    if(tabFormUrl){
      setTab(tabFormUrl)
    }

  })


  const handleSignout = async()=>{
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST"
      });

      const data = await res.json()

      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess())
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <Sidebar className='w-full md:w-56 '>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='cursor-pointer'>
          <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"User"} labelColor="dark">Profile </Sidebar.Item>
          <Sidebar.Item  icon={HiArrowSmRight} label={"User"} labelColor="dark" onClick={handleSignout}>Sign out </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar