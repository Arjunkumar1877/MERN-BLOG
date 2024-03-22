import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"


export const create = async(req, res, next)=>{
 console.log(req.user)
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not Allowed to create a post"))
    }

    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, "Please provide all required fields"))
    }


    const slug = req.body.title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    })

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }

}


export const getPost = async(req, res, next)=>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortedDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.serarchTerm && {
                $or: [
                    {title: { $regex: req.query.serarchTerm, $option: 'i'}},
                    {content: { $regex: req.query.serarchTerm, $option: 'i'}}
                ]
            })
    }).sort({ updatedAt: sortedDirection }).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
        createdAt: {$gte: oneMonthAgo}
    });



    res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts
    })

    } catch (error) {
        next(error)
    }
}