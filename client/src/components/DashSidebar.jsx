import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
function DashSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state)=> state.user)

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
        <Sidebar.ItemGroup className='cursor-pointer flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
          <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : "User"} as='div' labelColor="dark">Profile </Sidebar.Item>
          </Link>
        {
          currentUser.isAdmin &&  (
            <Link to={'/dashboard?tab=posts'}>
            <Sidebar.Item  active={tab=== 'posts'}  as='div' icon={HiDocumentText}>
              Posts
            </Sidebar.Item>
          </Link>
          )
        }
          <Sidebar.Item  icon={HiArrowSmRight}  onClick={handleSignout}>Sign out </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar