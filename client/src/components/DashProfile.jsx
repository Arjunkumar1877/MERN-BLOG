import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

function DashProfile() {
  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0)
  const [imgUploadError, setImgUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSucess] = useState(null);
  const [imgFileUploading, setImgfileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false)

  const filePickerRef = useRef();
  const { currentUser, error } = useSelector(state => state.user);
  const dispatch = useDispatch()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imgFile) {
      uploadImage();
    }
  }, [imgFile]);

  const uploadImage = async () => {
  
    setImgfileUploading(true)
    setImgUploadProgress(true);
    setImgUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imgFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImgUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImgUploadError(
          'Could not upload image (File must be less than 2MB)' + error
        );
        setImgUploadProgress(null);
        setImgFile(null);
        setImgFileUrl(null);
        setImgfileUploading(false);

      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImgUploadProgress(false);
        setImgfileUploading(false);

        });
      }
    );
  };

  console.log(imgUploadProgress);
  console.log(imgUploadProgress);

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSucess(null)
    if(Object.keys(formData).length === 0){
      setUpdateUserError("No Changes made")
     return;
    }
    if(imgFileUploading){
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: "PUT",
       headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify(formData)
      })

      const data = await res.json();

      console.log(data)
     if(!res.ok){
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
     }else{
      dispatch(updateSuccess(data));
      setUpdateUserSucess("User's profile updated sucessfully");
     }
    } catch (error) {
      console.log(error)
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const handleDeleteUser = async()=>{
  setShowModal(false)
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if(!res.ok){
      dispatch(deleteUserFailure(data.message))
    }else{
      dispatch(deleteUserSuccess(data))
    }

  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
  }

   return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className="my-7 fnt-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input hidden type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imgUploadProgress && (
            <CircularProgressbar
              value={imgUploadProgress || 0}
              text={`${imgUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imgUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imgFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]  ${
              imgUploadProgress &&
              imgUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
 {
  imgUploadError && <Alert color='failure'>{imgUploadError}</Alert>

 }
 <TextInput onChange={handleChange} type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
 <TextInput onChange={handleChange} type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
 <TextInput onChange={handleChange} type='password' id='password' placeholder='password' defaultValue="************" />
 <Button type='submit' gradientDuoTone='purpleToBlue' outline>
  Update
 </Button>
      </form>

      <div className="text-red-500 flex justify-between  mt-5">
        <span onClick={()=> setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span  className='cursor-pointer'>Sign Out</span>
      </div>


{
  updateUserSuccess && (
    <Alert color='success' className='mt-5'>
      {updateUserSuccess}
    </Alert>
  )
}

{
  updateUserError && (
    <Alert color='failure' className='mt-5'>
      { updateUserError }
    </Alert>
  )
}

{
  error && (
    <Alert color='failure' className='mt-5'>
      { error }
    </Alert>
  )
}


<Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
  <Modal.Header />
  <Modal.Body>
    <div className="text-center ">
    <HiOutlineExclamationCircle className='h-14 w-14 text-grey-400 dark:text-gray-200 mb-4 mx-auto' />

      <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account ?</h3>
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

export default DashProfile