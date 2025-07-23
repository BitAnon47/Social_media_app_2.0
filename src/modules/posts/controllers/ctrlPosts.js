const moment = require('moment')
const postService = require('../services/srvcPosts');


//-Adding posts-//
const add = async function (req, res, next) {
    try {
        
        let [data, err] = await postService.create(req);
        if (err) return next(err);
        return next({ data });


    }
    catch (error) { return next(error) }
};
//-List of the posts-//
const getListItems = async function (req, res, next) {
    try {
        let [list, err] = await postService.getList(req);
        if (err) return next(err);
        return res.json(list); // <-- Send response directly
    } catch (error) {
        return next(error);
    }
};

//--------Delete post------//
const deleteRecord = async function (req, res, next) {
    try {
        let { postId } = req.body;
        let userId = req.user.userId;
        let [result, err] = await postService.deleteRecord(postId, userId);
        if (err) return next(err);
        return next({ data: 'Deleted' });
    } catch (error) {
        return next(error);
    }
};

//Get post by ID
const get = async function (req, res, next) {
    try {
        let { postId } = req.body
        
        let [data, err] = await postService.getWithId(postId);
        if (err) return next(err);
        if (!data) return next(new TypeError('not_exist'));
        return next(data);

    }
    catch (error) { return next(error) }
};

//Edit post by ID
const update = async function (req, res, next) {
    
    try {
        let postId  = req.body.postId;
    
        let [result, err] = await postService.update(req, postId);
        if (err) return next(err);
        return next({ data: 'Updated' });

    }
    catch (error) { return next(error) }
};

/**
 * Get User's Posts (by user ID)
 */
const getUserPosts = async function (req, res, next) {
    try {
        console.log("Request data : ",req.user.userId);
        let userId  = req.user.userId;
        let [posts, err] = await postService.getByUserId(userId);
        if (err) return next(err);
        return next({ posts });
    } catch (error) {
        return next(error);
    }
};



module.exports = {
    add,
    getListItems,
    deleteRecord,
    get,
    update,
    getUserPosts,
    };
