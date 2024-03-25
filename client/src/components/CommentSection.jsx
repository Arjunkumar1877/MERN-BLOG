import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/comment/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments])
      }
    } catch (error) {
      setCommentError(error.message);
      console.log(error.message);
    }
  };

  useEffect(()=>{

    const getComments = async()=>{
        try {
              const res = await fetch(`/api/comment/getPostComments/${postId}`);
              if(res.ok){
                const data = await res.json();
                 setComments(data)
                 console.log(data)

              }
        } catch (error) {
            console.log(error)
        }
    }
 
    getComments();
  }, [postId])

  console.log(comments);

  const handleLikes = async(commentId)=>{
   try {
    if(!currentUser){
      navigate('/sign-in');
      return;
    }

    const res = await fetch(`/api/comment/likeComment/${commentId}`, {
      method: 'PUT'
    });
   
    if (res.ok){
      const data = await res.json();
      console.log(data);

      setComments(comments.map((com)=>  {
        return com._id === commentId ? {
        ...com, likes: data.likes.length, numberOfLikes: data.numberOfLikes
      }: com
    }))
    
    }
    
    

   } catch (error) {
    console.log(error.message)
   }
  }

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async(id)=>{
    try {
      const res = await fetch(`/api/comment/deleteComment/${id}`, {
        method: 'DELETE'
      })

      if(res.ok){
        console.log('deleted')

        setComments(comments.filter(comment => comment._id !== id));
        setShowModal(false)
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 tex-sm ">
          <p className="">Signed in as: </p>
          <img
            className="h-5 w-5 object-cover rounded-full "
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @ {currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5">
          You must be signed in to comment
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <TextInput
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500  text-xs">
              {200 - comment.length} Characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>



      )}


{
    comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet !</p>
    ) :(
    <>
        <div className="text-sm my-5 flex items-center">
            <p>Comments  :   </p>
            <div className="border border-gray-400 px-1 rounded-sm">
                <p>{comments.length}</p>
            </div>
        </div>
    
        {
            comments.map((comment)=>(
                <Comment key={comment._id} comment={comment} onLike={handleLikes} onEdit={handleEdit}  onDelete={(commentId)=>{
                  setShowModal(true);
                  setCommentToDelete(commentId)
                }}/>
            ))
        }
    </>
    )
}

<Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
  <Modal.Header />
  <Modal.Body>
    <div className="text-center ">
    <HiOutlineExclamationCircle className='h-14 w-14 text-grey-400 dark:text-gray-200 mb-4 mx-auto' />

      <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post ? ?</h3>
    <div className="flex justify-center gap-4">
      <Button color="failure" onClick={()=> handleDelete(commentToDelete)}>Yes I am sure</Button>
      <Button color="grey" onClick={()=> setShowModal(false)}>No, cancel</Button>
    </div>

    </div>
  </Modal.Body>
</Modal>
    </div>
  );
}

export default CommentSection;
