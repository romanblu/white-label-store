import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/UserModel.js'
import generateToken from '../utils/generateToken.js'

// @desc    register user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body

    const userExists = await User.findOne({ email })
    
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({name, email, password})
        
    if(user){
        generateToken(res, user._id)
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

})

// @desc    Logout user and clear cookies
// @route   POST /api/users
// @access  private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) })
    
    res.status(200).json({ message: 'Logged out successfully'})

})

// @desc    Login user 
// @route   POST /api/users
// @access  public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body

    const user = await User.findOne( { email } )

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    get users profile
// @route   GET /api/users/profile
// @access  private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin:user.isAdmin
        })
    }else{
        res.status(404)
        throw new Error('User was not found')
    }

})

// @desc    update users profile
// @route   PUT /api/users/profile
// @access  private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }else{
        res.status(404)
        throw new Error('User was not found')
    }
})

// @desc    get all users
// @route   GET /api/users
// @access  private/admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})


// @desc    update users profile
// @route   DELETE /api/users/:id
// @access  private/admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error('Cannot delete admin user')
        }

        await User.deleteOne({_id: user._id})
        res.status(200).json({ message: 'User deleted successfully'})
    }else{
        res.status(404)
        throw new Error('User not found')
    }

})


// @desc    get user by id
// @route   GET /api/users/:id
// @access  private/admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if(user){
        res.status(200).json(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    update user
// @route   PUT /api/users/:id
// @access  private/admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById({ _id: req.params.id})

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin
        
        const updatedUser = await user.save()
        res.status(200).json({ _id: updateUser._id, name: updateUser.name, email: updatedUser.email })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

export { 
    registerUser,
    logoutUser, 
    loginUser,
    getUserById, 
    getUserProfile, 
    updateUser, 
    updateUserProfile, 
    deleteUser,
    getUsers   
}