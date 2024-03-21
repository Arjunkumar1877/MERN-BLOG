import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {
  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0)
  const [imgUploadError, setImgUploadError] = useState(null);
  const filePickerRef = useRef()
  const { currentUser } = useSelector(state => state.user);

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
        setImgUploadProgress(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileUrl(downloadURL);
          // setFormData({ ...formData, profilePicture: downloadURL });
          setImgUploadProgress(false);
        });
      }
    );
  };

  console.log(imgUploadProgress);
  console.log(imgUploadProgress)

   return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className="my-7 fnt-semibold text-3xl">Profile</h1>
      <form className='flex flex-col gap-4 '>
        <input hidden type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} />
 <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=> filePickerRef.current.click()}>
  {imgUploadProgress &&  (
    <CircularProgressbar value={imgUploadProgress || 0} text={`${imgUploadProgress}`} strokeWidth={5} styles={{root:{
      width: "100%",
      height: "100%",
      position: 'absolute',
      top: 0,
      left: 0
    },
    path: {
      stroke: `rgba(62, 152, 199, ${imgUploadProgress/100})`
    }
  }} />
  )}
 <img src={imgFileUrl || currentUser.profilePicture} alt="user"  className={`w-full h-full rounded-full border-8 object-cover border-[lightgray]  ${imgUploadProgress && imgUploadProgress < 100 && 'opacity-60'}`}/>

 </div>
 {
  imgUploadError && <Alert color='failure'>{imgUploadError}</Alert>

 }
 <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
 <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
 <TextInput type='password' id='password' placeholder='password' defaultValue="************" />
 <Button type='submit' gradientDuoTone='purpleToBlue' outline>
  Update
 </Button>
      </form>

      <div className="text-red-500 flex justify-between  mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile