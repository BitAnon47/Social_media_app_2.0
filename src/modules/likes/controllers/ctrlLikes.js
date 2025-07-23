const likeService = require('../services/srvcLikes');

exports.toggleLike = async (req, res, next) => {
    try {
        const { targetId, targetType } = req.body; // targetType: 'post' or 'comment'
        const userId = req.user.id;
        const [liked, err] = await likeService.toggleLike({ userId, targetId, targetType });
        if (err) return next(err);
        return next({ liked });
    } catch (error) {
        return next(error);
    }
};

exports.countLikes = async (req, res, next) => {
    try {
        const { targetId, targetType } = req.query;
        const [count, err] = await likeService.countLikes({ targetId, targetType });
        if (err) return next(err);
        return next({ count });
    } catch (error) {
        return next(error);
    }
};