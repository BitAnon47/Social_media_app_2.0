const sequelize = require('../../../../db/sequelize/sequelize');

exports.toggleLike = async ({ userId, targetId, targetType }) => {
    try {
        const instance = new sequelize.db(sequelize.models.likes);
        const existing = await instance.findOne({ where: { userId, targetId, targetType } });
        if (existing) {
            await existing.destroy();
            return [false, null]; // Unliked
        } else {
            const [like, error] = await instance.create({ userId, targetId, targetType });
            if (error) return [null, error];
            return [true, null]; // Liked
        }
    } catch (error) {
        return [null, error];
    }
};

exports.countLikes = async ({ targetId, targetType }) => {
    try {
        const instance = new sequelize.db(sequelize.models.likes);
        const count = await instance.count({ where: { targetId, targetType } });
        return [count, null];
    } catch (error) {
        return [null, error];
    }
};