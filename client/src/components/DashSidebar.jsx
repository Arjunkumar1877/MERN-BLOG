import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useLocation } from 'react-router-dom';

function DashSidebar() {
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
  return (
    <Sidebar className='w-full md:w-56 '>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"User"} labelColor="dark">Profile </Sidebar.Item>
          <Sidebar.Item  icon={HiArrowSmRight} label={"User"} labelColor="dark">Sign out </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar