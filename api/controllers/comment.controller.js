import Comments from "../models/comment.model.js";



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