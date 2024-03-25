import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
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
                <Comment key={comment._id} comment={comment} onLike={handleLikes} onEdit={handleEdit}/>
            ))
        }
    </>
    )
}
    </div>
  );
}

export default CommentSection;
