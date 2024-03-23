import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import {FaCheck, FaTimes} from 'react-icons/fa'

function DashUsers() {
  const { currentUser } = useSelector((state)=> state.user);
  const [userData, setUserData] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  console.log(userData)
  useEffect(()=>{
    const fetchUsers = async()=>{
      try {
        const res = await fetch(`/api/user/getusers`);

        const data = await res.json();
        console.log(data)

        if(res.ok){
          console.log("data fetched");
          setUserData(data.users)
          if(data.users.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }

if(currentUser.isAdmin){
  fetchUsers();
}
  }, [currentUser._id])

  const handleShowMore =  async()=>{
    const startIndex = userData.length;
try {
  const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
  const data = await res.json();

  setUserData((prev)=> [...prev, ...data.users])
  if(data.users.length < 9){
    setShowMore(false)
  }
  console.log(data)
} catch (error) {
  console.log(error.message)
}  
}

  const handleDeleteUser = async()=>{
    setShowModal(false);

    try {
      const res = await fetch(`/api/user/deleteuser/${userIdToDelete}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if(!res.ok){
        console.log(data.message)
      }else{
        setUserData((prev)=>
          prev.filter((user)=> user._id !== userIdToDelete)
        )
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300  dark:scrollbar  dark:scrollbar-thumb-slate-500">
{
  currentUser.isAdmin && userData.length > 0 ? (
    <>
    <Table hoverable className="shadow-md">
      <Table.Head>
        <Table.HeadCell>Date created</Table.HeadCell>
        <Table.HeadCell>User image</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Admin</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
       
      </Table.Head>

      {
        userData && userData.map((user)=> (
        
          <Table.Body className="divide-y" key={user._id}>
            <Table.Row className="bg-white dark:border-gray-700  dark:bg-gray-800">
              <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
              <Table.Cell><Link to={`/user/${user.slug}`}>
                <img src={user.profilePicture} alt={user.username} className="rounded-full w-20 h-20 object-cover bg-gray-500" />
                </Link></Table.Cell>
              <Table.Cell>
                <Link className="font-medium text-gray-900 dark:text-white" to={`/user/${user.slug}`}>{user.username}</Link>
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-500" />: <FaTimes className="text-red-500" />}</Table.Cell>
              <Table.Cell><span className="font-medium text-red-500 hover:underline cursor-pointer" onClick={()=>{
                 setShowModal(true);
                 setUserIdToDelete(user._id);
              }}>Delete</span></Table.Cell>
             
            </Table.Row>
          </Table.Body>
        ))
      }
    </Table>

{
  showMore && (
    <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>Show more </button>
  )
}

    </>
  ): (
    <p>No Users!</p>
  )
}
        
<Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
  <Modal.Header />
  <Modal.Body>
    <div className="text-center ">
    <HiOutlineExclamationCircle className='h-14 w-14 text-grey-400 dark:text-gray-200 mb-4 mx-auto' />

      <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user ?</h3>
    <div className="flex justify-center gap-4">
      <Button color="failure" onClick={handleDeleteUser}>Yes I am sure</Button>
      <Button color="grey" onClick={()=> setShowModal(false)}>No, cancel</Button>
    </div>

    </div>
  </Modal.Body>
</Modal>
      </div>
  )
}

export default DashUsers
