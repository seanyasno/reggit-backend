import validateUser from './validators/user/validate-user';
import ProfileModel from './postgres/profile-model';
import UserModel from './postgres/user-model';
import PostModel from './postgres/post-model';
import LikeModel from './postgres/like-model';
import IUserAuth from './user-auth';
import IProfile from './profile';
import IUser from './user';
import IPost from './post';

UserModel.hasOne(ProfileModel);
UserModel.hasMany(PostModel);

ProfileModel.belongsTo(UserModel);
PostModel.belongsTo(UserModel);

export {
    validateUser,
    ProfileModel,
    UserModel,
    PostModel,
    LikeModel,
    IUserAuth,
    IProfile,
    IUser,
    IPost
}
