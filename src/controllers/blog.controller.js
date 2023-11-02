const fs = require("fs");
const asyncHandler = require("express-async-handler");

const { BlogSchema } = require("../models");

const {
  validateMongoId,
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
} = require("../utils");

// * create new blog
const createBlog = asyncHandler(async (req, res) => {
  req.body.author = req.user._id;
  const newBlog = await BlogSchema.create(req.body);
  res.status(201).json({
    status: true,
    message: "Blog created successfully",
    data: newBlog,
  });
});

// * update blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const updateBlog = await BlogSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: true,
    message: "Blog updated successfully",
    data: updateBlog,
  });
});

// * get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogSchema.find().populate({
    path: "author",
    select: "_id firstname email",
  });
  res.status(200).json({
    status: true,
    message: "Blogs fetched successfully",
    data: blogs,
  });
});

// * get blog by id
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const blog = await BlogSchema.findById(id);
  if (!blog) throw new Error("Blog not found");

  const blogView = await BlogSchema.findByIdAndUpdate(
    id,
    { $inc: { numViews: 1 } },
    { new: true }
  )
    .populate("likes")
    .populate("dislikes")
    .populate({
      path: "author",
      select: "_id firstname email",
    });
  res.status(200).json({
    status: true,
    message: "Blog fetched successfully",
    data: blogView,
  });
});

// * delete blog by id
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const blog = await BlogSchema.findByIdAndDelete(id);
  if (!blog) throw new Error("Blog not found");
  res.status(200).json({
    status: true,
    message: "Blog deleted successfully",
    data: {
      id: blog._id,
      title: blog.title,
    },
  });
});

// * like blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const loginUserId = req.user._id;

  const blog = await BlogSchema.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  const alreadyDisliked = blog.dislikes.includes(loginUserId);
  const alreadyLiked = blog.likes.includes(loginUserId);

  if (alreadyDisliked) {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } else if (alreadyLiked) {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  }
});

// * dislike blog
const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const loginUserId = req.user._id;

  const blog = await BlogSchema.findById(blogId);

  const alreadyLiked = blog.likes.includes(loginUserId);
  const alreadyDisliked = blog.dislikes.includes(loginUserId);

  if (alreadyLiked) {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );

    res.json(updatedBlog);
  } else if (alreadyDisliked) {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  }
});

// * update images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;

    const maxImages = 2;

    const blogId = req.params.id;
    const blog = await BlogSchema.findById(blogId);
    if (!blog) throw new Error("blog not found");

    if (blog.images.length >= maxImages) {
      for (const file of files) {
        const { path } = file;
        fs.unlinkSync(path);
      }
      throw new Error("Maximum number of images reached: " + maxImages);
    }

    for (const file of files) {
      const { path } = file;
      console.log(path);
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => {
      return file;
    });

    blog.images = blog.images.concat(images);
    await blog.save();
    res.json({
      message: "Images uploaded successfully",
      data: {
        id: blog._id,
        images: blog.images,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * delete images
const deleteImages = asyncHandler(async (req, res) => {
  const id = req.body.publicImageId;
  const blogId = req.body.blogId;
  try {
    await cloudinaryDeleteImage(id, "images");

    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      { $pull: { images: { public_id: id } } },
      { new: true }
    );
    res.json({
      message: "Image deleted",
      data: {
        id: blog._id,
        images: blog.images,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  disliketheBlog,
  uploadImages,
  deleteImages,
};
