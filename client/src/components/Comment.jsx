import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

function Comment({comment, onLike, onEdit}) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user)
    useEffect(()=>{
        const getUser = async()=>{
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();

               if(res.ok){
                console.log(data);
                setUser(data)
               }
            } catch (error) {
                console.log(error.message)
            }
        }

getUser();

    }, [comment])

    const handleEdit = ()=>{
setIsEditing(true);
setEditedContent(comment.content);
    }

    const handleSave = async()=>{
      try {

        console.log(editedContent)
        const res = await fetch(`/api/comment/editComment/${comment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: editedContent
          })
        });
        
if(res.ok){
  setIsEditing(false);
  onEdit(comment, editedContent);
}
      
      } catch (error) {
        console.log(error.message)
      }
    }
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
     <div className="flex-shrink-0 mr-3 ">
      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200"/>
     </div>
     <div className="flex-1">
      <div className="flex items-center mb-1">
        <span className="font-bold mr-1 text-xs truncate ">{user ? `@${user.username}` : "anonymous user"}</span>
         <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}
         </span>
      </div>
{
  isEditing ? (
         <>
    <Textarea onChange={(e)=> setEditedContent(e.target.value)} value={editedContent}  className="mb-2"   />
         <div className="flex justify-end gap-2">
          <Button type='button' size='sm' onClick={handleSave} color='primary' gradientDuoTone='purpleToBlue'>
         Save
          </Button>
          <Button onClick={()=> setIsEditing(false)} type='button' size='sm' color='primary' gradientDuoTone='purpleToBlue'>
         Cancel
          </Button>
          
         </div>
         </>
    ) : (
    <>
    
    <p className="text-gray-500 pb-2 ">{comment.content}</p>
      <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
      <button
    type='button'
    onClick={() => onLike(comment._id)}
    className={`text-gray-400 hover:text-blue-500 ${
        currentUser &&
        Array.isArray(comment.likes) &&
        comment.likes.includes(currentUser._id) &&
        '!text-blue-500'
    }`}
>
    <FaThumbsUp className='text-sm' />
</button>

<p className="text-gray-400">
  {
    comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes") 
  }
</p>

{
  currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
    <button onClick={handleEdit} type="button" className="text-gray-400 hover:text-blue-500">
      Edit
    </button>
  )
}
      </div>
    </>
  )
}

     </div>
    </div>
  )
}

export default Comment
