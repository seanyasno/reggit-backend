import validateUser from './validators/user/validate-user';
import ProfileModel from './postgres/profile-model';
import UserModel from './postgres/user-model';
import PostModel from './postgres/post-model';
import IUserAuth from './user-auth';
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
    IUserAuth,
    IPost
}
