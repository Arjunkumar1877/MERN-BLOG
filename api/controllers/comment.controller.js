import Comments from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";



export const createComment = async(req, res, next)=>{
    try {
        const { content, postId, userId } = req.body;

        if(userId !== req.user.id){
            return next('You are not allowed to create this comment')
        }

        const newComment = new Comments({
            content,
            postId,
            userId
        });

        await newComment.save()

        res.status(200).json(newComment)


    } catch (error) {
        next(error);
    }
}


export const getPostComments = async(req, res, next)=>{
    try {
        const comments = await Comments.find({postId: req.params.postId}).sort({createdAt: -1});

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}


export const editComment = async(req, res, next)=>{
    try {
        const comment = await Comments.findById(req.params.commentId);
 console.log(req.body.content +   " " + req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'Comment not found!'));
        }

        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not allowed to edit this comment !'))
        }

        comment.content = req.body.content;
        const editedComment = await comment.save()
        
console.log(editedComment)
      
        res.status(200).json(editedComment);

    } catch (error) {
        next(error)
    }
}


export const deleteComment = async(req, res, next)=>{
    try {
        const comment = await Comments.findById(req.params.commentId);

        if(!comment){
            return next(errorHandler(404, 'Comment not found !'));
        }

        if(comment.userId !== req.user.id  && !req.user.isAdmin){
            return next(errorHandler(403, "You are not allowed  to delete this comment"));
        }

        await Comments.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted');


    } catch (error) {
        
    }
}