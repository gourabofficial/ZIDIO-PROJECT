import { User } from "../model/user.model.js";
import { clerkClient } from "@clerk/express";
// import {  clerkClient } from "@clerk/clerk-sdk-node";


export const checkedUserLogin = async (req, res) => {
  try {
    const { clerkId } = req.body;
    if (!clerkId) {
      return res.status(400).json(
        {
          message: "Clerk ID is required",
          success: false
        }
      );
    }

    const clerkuser = await clerkClient.users.getUser(clerkId);
    if (!clerkuser) {
      return res.status(404).json(
        {
          message: "Failed to fetch user from Clerk",
          success: false
        }
      )
    }

    const fullName = `${clerkuser.firstName || ""} ${clerkuser.lastName || ""}`.trim();
    const email = clerkuser.emailAddresses[0].emailAddresses;

    //check admin role 
    // const isAdmin = clerkuser.publicMetadata.role === "admin";
    // if (isAdmin) {
    //   return res.status(200).json(
    //     {
    //       message: "User is an admin",
    //       success: true
    //     }
    //   )
    // }

    if (!email || !fullName) {
      return res.status(404).json(
        {
          message: "User Name and Email are not Found",
          success: false
        }
      )
    }

    const isExistUser = await User.findOne({ clerkId });


    if (!isExistUser) {
      const newUser = await User.create({
        clerkId,
        fullName,
        email,
      })
      if (!newUser) {
        return res.status(404).json(
          {
            message: "Failed to create user",
            success: false
          }
        )
      }
      return res.status(201).json(
        {
          message: "User created successfully",
          success: true,
          user: newUser
        }

      )
    } else {
      return res.status(200).json(
        {
          message: "User already exists",
          success: true,
          user: isExistUser
        }
      )
    }

  } catch (error) {
    console.error("Error checking user login:", error);
    return res.status(500).json(
      {
        message: "Internal server error",
        success: false
      }
    );
  }
}
