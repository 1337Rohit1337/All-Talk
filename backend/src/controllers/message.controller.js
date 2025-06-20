import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserid = req.user._id;
        const filteredUsers = await User.find({id:{$ne: loggedInUserid}}).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersForSideBar controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
  };
export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
export const sendMessage = async (req,res) => {
    try {
        const{text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
    
        let imageUrl;
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
          });
    
        await newMessage.save();
    
    } catch (error) {
        console.log("Error in message controller",error.message)
        res.status(500).json({message:"Internal server error"});
}
}

