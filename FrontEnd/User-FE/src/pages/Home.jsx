import { useState } from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PostCard from "@/components/forum/PostCard";
import CreatePostForm from "@/components/forum/CreatePostForm";
import UserConnectionItem from "@/components/user/UserConnectionItem";
import {
  getForumPosts,
  createForumPost,
  updateForumPost,
  reactToPost,
  removeReaction,
  addComment,
  sharePost,
  deleteForumPost,
  getPopularHashtags,
} from "@/services/forumService";
import {
  getSuggestedConnections,
  sendConnectionRequest,
} from "@/services/userService";
import {
  Calendar,
  Bookmark,
  Bell,
  Users,
  PenTool,
  Image,
  Search,
  TrendingUp,
  Award,
  Filter,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Fetch forum posts
  const {
    data: postsData = { content: [], totalElements: 0, totalPages: 0 },
    isLoading: isLoadingPosts,
    error: postsError,
  } = useQuery({
    queryKey: ["forumPosts"],
    queryFn: () => getForumPosts(axiosPrivate, 0, 10, "createdAt", "desc"),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 30 * 60 * 1000, // 30 phút
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Luôn refetch khi component được mount
  });

  // Fetch popular hashtags
  const { data: hashtags = [], isLoading: isLoadingHashtags } = useQuery({
    queryKey: ["popularHashtags"],
    queryFn: () => getPopularHashtags(axiosPrivate),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch suggested connections (users)
  const { data: suggestedUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => getSuggestedConnections(axiosPrivate),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ postId, content }) =>
      addComment(axiosPrivate, postId, content),
    onSuccess: (data, variables) => {
      if (!data) return;

      // Lấy dữ liệu hiện tại từ cache
      const currentData = queryClient.getQueryData(["forumPosts"]);
      if (!currentData || !currentData.content) return;

      const postId = variables.postId;
      const postIndex = currentData.content.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        // Nếu tìm thấy bài viết, cập nhật thông tin bình luận mới với dữ liệu thực từ API
        const updatedContent = [...currentData.content];
        const updatedPost = { ...updatedContent[postIndex] };

        // Cập nhật danh sách bình luận
        const comments = updatedPost.comments || [];

        // Tìm và xóa bình luận tạm có nội dung trùng với bình luận thật
        const filteredComments = comments.filter(
          (comment) =>
            !(
              comment.content === variables.content &&
              (comment.id.toString().startsWith("temp-") || // Comment tạm thời
                new Date() - new Date(comment.createdAt) < 10000)
            ) // Hoặc comment vừa tạo trong 10 giây gần đây
        );

        // Thêm bình luận thật vào đầu danh sách
        updatedPost.comments = [data, ...filteredComments];

        // Cập nhật tổng số bình luận
        updatedPost.commentCount =
          (updatedPost.commentCount || filteredComments.length) + 1;

        updatedContent[postIndex] = updatedPost;

        // Cập nhật cache với dữ liệu mới
        queryClient.setQueryData(["forumPosts"], {
          ...currentData,
          content: updatedContent,
        });

        // Cập nhật trong cache comments
        const commentsKey = ["comments", postId];
        const currentComments = queryClient.getQueryData(commentsKey) || [];

        // Lọc bỏ comment tạm thời trùng lặp
        const filteredCachedComments = currentComments.filter(
          (comment) =>
            !(
              comment.content === variables.content &&
              (comment.id.toString().startsWith("temp-") ||
                new Date() - new Date(comment.createdAt) < 10000)
            )
        );

        // Cập nhật cache với comment thật từ API
        queryClient.setQueryData(commentsKey, [
          data,
          ...filteredCachedComments,
        ]);

        // Lưu vào localStorage
        try {
          // Lưu forumPosts vào localStorage
          localStorage.setItem(
            "forumPosts",
            JSON.stringify(queryClient.getQueryData(["forumPosts"]))
          );

          // Lưu comments vào localStorage
          localStorage.setItem(
            `comments-post-${postId}`,
            JSON.stringify([data, ...filteredCachedComments])
          );
        } catch (e) {
          console.error("Lỗi khi lưu vào localStorage:", e);
        }
      }
    },
    onError: (error) => {
      console.error("Lỗi khi thêm bình luận:", error);
      toast.error("Đã có lỗi xảy ra khi thêm bình luận.");
    },
  });

  // Share post mutation
  const shareMutation = useMutation({
    mutationFn: ({ postId, content }) =>
      sharePost(axiosPrivate, postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  // Handle create/update post submission
  const handlePostSubmit = async (postData, file) => {
    try {
      console.log("Bắt đầu tạo/cập nhật bài viết", postData);
      let responseData;

      if (editingPost) {
        // Đang cập nhật bài viết
        responseData = await updateForumPost(
          axiosPrivate,
          editingPost.id,
          postData,
          file
        );
        toast.success("Bài viết đã được cập nhật");
        setEditingPost(null);
      } else {
        // Đang tạo bài viết mới
        responseData = await createForumPost(axiosPrivate, postData, file);
        toast.success("Bài viết đã được tạo");
      }

      // Đóng form tạo bài viết
      setIsCreatePostOpen(false);

      // Cập nhật cache thủ công để đảm bảo hình ảnh được hiển thị ngay
      if (responseData) {
        console.log("Dữ liệu phản hồi từ API:", responseData);

        // Chuẩn hóa dữ liệu từ API để đảm bảo các trường hình ảnh đính kèm được xử lý đúng
        const normalizedPost = {
          ...responseData,
          // Đảm bảo cả hai trường đều có dữ liệu (cho trường hợp backend chỉ trả về một trong hai)
          attachment_url:
            responseData.attachmentUrl || responseData.attachment_url,
          attachment_type:
            responseData.attachmentType ||
            responseData.attachment_type ||
            "NONE",
          // Đảm bảo người dùng đầy đủ thông tin
          userName: responseData.userName || auth?.user?.userName,
          userImageUrl: responseData.userImageUrl || auth?.user?.imageUrl,
        };

        console.log("Dữ liệu bài viết đã chuẩn hóa:", normalizedPost);

        // Cập nhật queryClient cache
        const currentData = queryClient.getQueryData(["forumPosts"]);
        if (currentData && currentData.content) {
          let updatedContent;

          if (editingPost) {
            // Cập nhật bài viết hiện có trong cache
            updatedContent = currentData.content.map((post) =>
              post.id === normalizedPost.id ? normalizedPost : post
            );
          } else {
            // Thêm bài viết mới vào đầu danh sách
            updatedContent = [normalizedPost, ...currentData.content];
          }

          // Cập nhật cache
          queryClient.setQueryData(["forumPosts"], {
            ...currentData,
            content: updatedContent,
          });

          // Lưu vào localStorage
          try {
            localStorage.setItem(
              "forumPosts",
              JSON.stringify({
                ...currentData,
                content: updatedContent,
              })
            );
          } catch (error) {
            console.error("Lỗi khi lưu dữ liệu vào localStorage:", error);
          }
        }
      }

      // Làm mới danh sách bài viết
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý bài viết:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  // Handle post reaction
  const handleReaction = async (postId, reactionType) => {
    console.log("Xử lý phản ứng:", postId, reactionType);
    try {
      // Lấy dữ liệu hiện tại từ cache
      const currentData = queryClient.getQueryData(["forumPosts"]);

      if (!currentData || !currentData.content) return;

      // Tìm bài viết hiện tại
      const currentPost = currentData.content.find((p) => p.id === postId);
      if (!currentPost) return;

      // Lấy phản ứng hiện tại của người dùng
      const oldReaction = currentPost.userReaction;

      // Xác định phản ứng mới sẽ là gì:
      // - Nếu người dùng nhấn vào cùng phản ứng hiện tại -> xóa phản ứng (null)
      // - Nếu người dùng nhấn vào phản ứng khác -> thay đổi phản ứng
      const newReaction = oldReaction === reactionType ? null : reactionType;

      console.log(`Thay đổi phản ứng từ ${oldReaction} -> ${newReaction}`);

      // Cập nhật UI ngay lập tức (Optimistic Update)
      const updatedContent = currentData.content.map((post) => {
        if (post.id === postId) {
          // Tạo bản sao của reactionCounts
          const newReactionCounts = { ...post.reactionCounts };

          // Nếu đã có phản ứng cũ, giảm đi 1
          if (oldReaction && newReactionCounts[oldReaction]) {
            newReactionCounts[oldReaction] = Math.max(
              0,
              newReactionCounts[oldReaction] - 1
            );
          }

          // Nếu có phản ứng mới, tăng lên 1
          if (newReaction) {
            newReactionCounts[newReaction] =
              (newReactionCounts[newReaction] || 0) + 1;
          }

          return {
            ...post,
            userReaction: newReaction, // Cập nhật phản ứng hiện tại
            userReactionUserId: auth?.user?.id, // Thêm userId cho phản ứng để phân biệt giữa các người dùng
            reactionCounts: newReactionCounts,
          };
        }
        return post;
      });

      // Cập nhật cache với dữ liệu mới
      queryClient.setQueryData(["forumPosts"], {
        ...currentData,
        content: updatedContent,
      });

      // Lưu thông tin phản ứng vào nhiều cache key khác nhau để đảm bảo dữ liệu được giữ lại
      // 1. Key chính cho reaction của post
      const postReactionKey = ["postReaction", postId];
      queryClient.setQueryData(postReactionKey, {
        postId,
        reactionType: newReaction,
        previousReaction: oldReaction,
        timestamp: new Date().toISOString(),
        userId: auth?.user?.id,
      });

      // 2. Key dạng string để lưu vào localStorage dễ dàng hơn
      const reactionStringKey = `reaction-post-${postId}`;
      queryClient.setQueryData([reactionStringKey], {
        type: newReaction,
        timestamp: new Date().toISOString(),
        userId: auth?.user?.id,
      });

      // 3. Key cho tất cả reaction của người dùng hiện tại
      if (auth?.user?.id) {
        const userReactionsKey = ["userReactions", auth.user.id];
        const currentUserReactions =
          queryClient.getQueryData(userReactionsKey) || {};

        queryClient.setQueryData(userReactionsKey, {
          ...currentUserReactions,
          [postId]: {
            type: newReaction,
            timestamp: new Date().toISOString(),
          },
        });
      }

      // Lưu trực tiếp vào localStorage
      try {
        const updatedPost = updatedContent.find((p) => p.id === postId);

        // Lưu reaction
        if (newReaction) {
          localStorage.setItem(
            reactionStringKey,
            JSON.stringify({
              type: newReaction,
              postId: postId,
              userId: auth?.user?.id,
              timestamp: new Date().toISOString(),
            })
          );
        } else {
          // Xóa reaction nếu người dùng bỏ phản ứng
          localStorage.removeItem(reactionStringKey);
        }

        // Lưu reactionCounts
        if (updatedPost && updatedPost.reactionCounts) {
          localStorage.setItem(
            `reactionCounts-${postId}`,
            JSON.stringify(updatedPost.reactionCounts)
          );
        }

        // Lưu forumPosts vào localStorage - đảm bảo thông tin userReactionUserId được lưu
        localStorage.setItem(
          "forumPosts",
          JSON.stringify(queryClient.getQueryData(["forumPosts"]))
        );
      } catch (e) {
        console.error("Lỗi khi lưu reaction vào localStorage:", e);
      }

      try {
        // Gọi API tương ứng và đợi phản hồi
        let response;

        if (newReaction) {
          // Thêm hoặc thay đổi phản ứng
          response = await reactToPost(axiosPrivate, postId, newReaction);
          console.log("Phản ứng thành công:", response);

          // Lưu dữ liệu vào cache
          queryClient.setQueryData(["reactions", "post", postId], {
            type: newReaction,
            timestamp: new Date().toISOString(),
            userId: auth?.user?.id, // Thêm userId để xác định người dùng
          });
        } else {
          // Xóa phản ứng (trong trường hợp oldReaction không null)
          if (oldReaction) {
            response = await removeReaction(axiosPrivate, postId, oldReaction);
            console.log("Đã xóa phản ứng:", response);
            // Xóa dữ liệu khỏi cache
            queryClient.removeQueries(["reactions", "post", postId]);
          }
        }

        // THAY ĐỔI: Không gọi invalidateQueries sau khi API thành công
        // Thay vào đó chỉ cập nhật cache khi cần thiết
        if (response) {
          // Bảo vệ trạng thái của posts sau khi API hoàn thành
          const latestData = queryClient.getQueryData(["forumPosts"]);
          if (latestData && latestData.content) {
            // Tìm post mới nhất
            const latestPost = latestData.content.find((p) => p.id === postId);

            // Tạo query key cho reaction counts
            const reactionCountsKey = ["reactionCounts", postId];

            // Lưu số lượng reactions vào cache
            queryClient.setQueryData(reactionCountsKey, {
              postId,
              counts: latestPost?.reactionCounts || {},
              timestamp: new Date().toISOString(),
              userId: auth?.user?.id, // Lưu userId để phân biệt giữa các người dùng
            });

            // Lưu lại dữ liệu forumPosts vào localStorage
            try {
              localStorage.setItem("forumPosts", JSON.stringify(latestData));

              // Lưu reaction counts vào localStorage
              if (latestPost && latestPost.reactionCounts) {
                localStorage.setItem(
                  `reactionCounts-${postId}`,
                  JSON.stringify(latestPost.reactionCounts)
                );
              }
            } catch (e) {
              console.log("Không thể lưu vào localStorage:", e);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi xử lý phản ứng:", err);
        toast.error("Đã có lỗi xảy ra khi xử lý phản ứng, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi chung khi xử lý phản ứng:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  // Handle comment submission
  const handleComment = (postId, content) => {
    try {
      // Lấy dữ liệu hiện tại từ cache
      const currentData = queryClient.getQueryData(["forumPosts"]);

      if (!currentData || !currentData.content) return;

      // Tìm bài viết hiện tại
      const postIndex = currentData.content.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      // Lấy danh sách comments hiện tại
      const existingComments = currentData.content[postIndex].comments || [];

      // Kiểm tra trùng lặp: nếu có comment cùng nội dung, cùng người dùng trong 5 giây gần đây
      const isDuplicate = existingComments.some(
        (comment) =>
          comment.content === content &&
          comment.userId === auth?.user?.id &&
          new Date() - new Date(comment.createdAt) < 5000
      );

      if (isDuplicate) {
        console.log("Phát hiện comment trùng lặp, bỏ qua");
        return;
      }

      // Tạo comment mới với ID tạm thời rõ ràng
      const newComment = {
        id: `temp-${Date.now()}`, // ID tạm thời có prefix
        content: content,
        userId: auth?.user?.id,
        postId: postId,
        userName:
          auth?.user?.userName || auth?.user?.username || auth?.user?.name,
        userImageUrl: auth?.user?.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        replyCount: 0,
        userReaction: false,
      };

      // Cập nhật UI ngay lập tức (Optimistic Update)
      const updatedContent = [...currentData.content];
      const updatedPost = { ...updatedContent[postIndex] };

      // Thêm comment vào danh sách nếu có, hoặc tạo mảng mới
      updatedPost.comments = updatedPost.comments || [];
      updatedPost.comments.unshift(newComment);
      updatedPost.commentCount = (updatedPost.commentCount || 0) + 1;

      updatedContent[postIndex] = updatedPost;

      // Cập nhật cache với dữ liệu mới
      queryClient.setQueryData(["forumPosts"], {
        ...currentData,
        content: updatedContent,
      });

      // Lưu trữ comments vào nhiều cache key để đảm bảo dữ liệu được giữ lại
      // 1. Key chính cho comments của post
      const commentsKey = ["comments", postId];
      const existingCachedComments =
        queryClient.getQueryData(commentsKey) || [];

      // Kiểm tra và loại bỏ các comment trùng lặp trong cache
      const filteredCachedComments = existingCachedComments.filter(
        (comment) =>
          !(
            comment.content === content &&
            comment.userId === auth?.user?.id &&
            (comment.id.toString().startsWith("temp-") ||
              new Date() - new Date(comment.createdAt) < 5000)
          )
      );

      queryClient.setQueryData(commentsKey, [
        newComment,
        ...filteredCachedComments,
      ]);

      // 2. Key dạng string để lưu vào localStorage dễ dàng hơn
      const commentsStringKey = `comments-post-${postId}`;
      queryClient.setQueryData(
        [commentsStringKey],
        [newComment, ...filteredCachedComments]
      );

      // 3. Key cho tất cả comment của người dùng hiện tại
      if (auth?.user?.id) {
        const userCommentsKey = ["userComments", auth.user.id];
        const currentUserComments =
          queryClient.getQueryData(userCommentsKey) || {};

        if (!currentUserComments[postId]) {
          currentUserComments[postId] = [];
        }

        queryClient.setQueryData(userCommentsKey, {
          ...currentUserComments,
          [postId]: [newComment, ...(currentUserComments[postId] || [])],
        });
      }

      // Lưu trữ số lượng comments
      const commentCountKey = ["commentCount", postId];
      queryClient.setQueryData(commentCountKey, {
        data: {
          totalCount: updatedPost.commentCount,
        },
        postId,
        timestamp: new Date().toISOString(),
      });

      // Lưu trực tiếp vào localStorage để đảm bảo dữ liệu được giữ lại
      try {
        localStorage.setItem(
          "forumPosts",
          JSON.stringify(queryClient.getQueryData(["forumPosts"]))
        );

        // Kiểm tra và lọc trùng lặp trước khi lưu vào localStorage
        const existingLocalStorageComments = localStorage.getItem(
          `comments-post-${postId}`
        );
        let parsedLocalComments = [];

        if (existingLocalStorageComments) {
          try {
            parsedLocalComments = JSON.parse(existingLocalStorageComments);
            // Lọc bớt comment trùng lặp
            parsedLocalComments = parsedLocalComments.filter(
              (comment) =>
                !(
                  comment.content === content &&
                  comment.userId === auth?.user?.id &&
                  (comment.id.toString().startsWith("temp-") ||
                    new Date() - new Date(comment.createdAt) < 5000)
                )
            );
          } catch (e) {
            console.error("Lỗi khi parse comments từ localStorage:", e);
          }
        }

        localStorage.setItem(
          `comments-post-${postId}`,
          JSON.stringify([newComment, ...parsedLocalComments])
        );
      } catch (e) {
        console.log("Không thể lưu vào localStorage:", e);
      }

      // Gọi API
      commentMutation.mutate(
        { postId, content },
        {
          onSuccess: (data) => {
            if (!data) return;

            // Cập nhật lại danh sách comments với dữ liệu thực từ API
            const updatedComments = queryClient.getQueryData(commentsKey) || [];

            // Tìm và thay thế comment tạm bằng comment thật từ API
            const updatedCommentsList = updatedComments.map((comment) => {
              // Nếu là comment vừa thêm (có ID tạm), thay thế bằng dữ liệu từ API
              if (
                comment.id === newComment.id ||
                (comment.content === content &&
                  comment.userId === auth?.user?.id &&
                  new Date() - new Date(comment.createdAt) < 10000)
              ) {
                return { ...data };
              }
              return comment;
            });

            // Cập nhật cache với dữ liệu mới
            queryClient.setQueryData(commentsKey, updatedCommentsList);

            // Cập nhật localStorage với dữ liệu mới
            try {
              localStorage.setItem(
                `comments-post-${postId}`,
                JSON.stringify(updatedCommentsList)
              );
            } catch (e) {
              console.log("Không thể cập nhật localStorage:", e);
            }
          },
          onError: (error) => {
            // Nếu có lỗi, khôi phục lại trạng thái trước khi optimistic update
            queryClient.setQueryData(["forumPosts"], currentData);
            // Xóa comment tạm khỏi cache
            const currentComments = queryClient.getQueryData(commentsKey) || [];
            queryClient.setQueryData(
              commentsKey,
              currentComments.filter((c) => c.id !== newComment.id)
            );

            toast.error("Đã có lỗi xảy ra khi thêm bình luận.");
            console.error("Lỗi khi thêm bình luận:", error);
          },
        }
      );
    } catch (error) {
      console.error("Lỗi xử lý thêm bình luận:", error);
      // Fallback if optimistic update fails
      commentMutation.mutate({ postId, content });
    }
  };

  // Handle post sharing
  const handleShare = (postId) => {
    shareMutation.mutate({ postId, content: "" });
  };

  // Handle post edit
  const handleEdit = (post) => {
    setEditingPost(post);
  };

  // Handle post deletion
  const handleDelete = (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này không?")) {
      try {
        deleteForumPost(axiosPrivate, postId)
          .then(() => {
            toast.success("Bài viết đã được xóa");
            queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
          })
          .catch((error) => {
            console.error("Lỗi khi xóa bài viết:", error);
            toast.error(
              "Đã xảy ra lỗi khi xóa bài viết, vui lòng thử lại sau."
            );
          });
      } catch (error) {
        console.error("Lỗi xử lý xóa bài viết:", error);
      }
    }
  };

  // Handle connecting with user
  const handleConnect = (userId) => {
    // Gọi API gửi yêu cầu kết nối
    sendConnectionRequest(axiosPrivate, userId)
      .then(() => {
        // Hiển thị thông báo thành công
        alert("Đã gửi lời mời kết nối thành công!");
        // Làm mới danh sách gợi ý kết nối
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      })
      .catch((error) => {
        console.error(
          `Lỗi khi gửi lời mời kết nối đến user ID: ${userId}`,
          error
        );
        alert("Có lỗi xảy ra khi gửi lời mời kết nối. Vui lòng thử lại sau.");
      });
  };

  // Mock news và events
  const latestNews = [
    { id: 1, title: "Hội nghị Nông nghiệp xanh 2023", date: "24/11/2023" },
    { id: 2, title: "Triển lãm công nghệ nông nghiệp", date: "15/12/2023" },
    { id: 3, title: "Cập nhật kỹ thuật nuôi trồng mới", date: "10/01/2024" },
  ];

  // Format user role label
  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "EXPERT":
        return "Chuyên gia nông nghiệp";
      case "FARMER":
        return "Nông dân";
      case "SUPPLIER":
        return "Nhà cung cấp";
      default:
        return role;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-2 md:px-4 py-4 mt-14">
        {/* Sticky Search bar with shortcuts */}
        <div className="sticky top-16 z-10 bg-white shadow-sm p-2 mb-4 rounded-lg flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Tìm kiếm bài viết, hashtag..."
              className="pl-10 bg-gray-50 hover:bg-white focus:bg-white transition-colors"
            />
          </div>
          <Button variant="outline" className="gap-1">
            <Filter size={16} />
            <span className="hidden sm:inline">Lọc</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <TrendingUp size={16} />
            <span className="hidden sm:inline">Xu hướng</span>
          </Button>
        </div>

        {/* Tìm kiếm và thông tin nhanh */}
        <div className="hidden md:flex justify-between items-center mb-4">
          <div className="relative w-2/5">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Tìm kiếm bài viết, chủ đề, người dùng..."
              className="pl-10 bg-white"
            />
          </div>

          <div className="flex gap-4">
            <Badge
              variant="outline"
              className="bg-green-50 hover:bg-green-100 cursor-pointer"
            >
              <TrendingUp size={14} className="mr-1 text-green-600" />
              <span className="text-green-700">Nông nghiệp thông minh</span>
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 cursor-pointer"
            >
              <Award size={14} className="mr-1 text-blue-600" />
              <span className="text-blue-700">Sản phẩm chất lượng cao</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-3 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <div className="h-20 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className="absolute -bottom-6 left-4">
                  <Avatar className="h-14 w-14 border-4 border-white">
                    <AvatarImage
                      src={auth?.user?.imageUrl || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback>
                      {auth?.user?.username?.charAt(0) ||
                        auth?.user?.userName?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="pt-8 pb-3 px-4">
                <h3 className="text-lg font-semibold">
                  {auth?.user?.username || auth?.user?.userName || "Người dùng"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {auth?.user?.email || ""}
                </p>
              </div>
              <div className="border-t border-b px-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    Xem hồ sơ của bạn
                  </span>
                  <span className="text-sm text-gray-500">100 lượt xem</span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <Bookmark size={16} className="text-gray-500" />
                  <span>Lưu bài viết</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <Users size={16} className="text-gray-500" />
                  <span>Nhóm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Sự kiện</span>
                </div>
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <TrendingUp size={18} className="mr-2 text-green-600" />
                Chủ đề thịnh hành
              </h3>
              <div className="space-y-3">
                {isLoadingHashtags ? (
                  <div className="text-sm text-gray-500">Đang tải...</div>
                ) : (
                  Array.isArray(hashtags) &&
                  hashtags.map((tag, index) => (
                    <div
                      key={tag?.id || index}
                      className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-blue-600">
                          #{tag?.name || "hashtag"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tag?.postCount || 0} bài viết
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-normal">
                        Theo dõi
                      </Badge>
                    </div>
                  ))
                )}

                {/* Fallback hashtags */}
                {!isLoadingHashtags &&
                  (!hashtags ||
                    !Array.isArray(hashtags) ||
                    hashtags.length === 0) && (
                    <div className="space-y-3">
                      <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-blue-600">
                            #nôngnghiệp
                          </p>
                          <p className="text-xs text-gray-500">124 bài viết</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-normal">
                          Theo dõi
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-blue-600">
                            #caytrongvumua
                          </p>
                          <p className="text-xs text-gray-500">98 bài viết</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-normal">
                          Theo dõi
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-blue-600">
                            #nongsanthuanviet
                          </p>
                          <p className="text-xs text-gray-500">76 bài viết</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-normal">
                          Theo dõi
                        </Badge>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Hoạt động gần đây */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <Clock size={18} className="mr-2 text-green-600" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Bạn đã thích bài viết của{" "}
                      <span className="font-medium">Nguyễn Văn A</span>
                    </p>
                    <p className="text-xs text-gray-500">2 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Bạn đã bình luận về{" "}
                      <span className="font-medium">
                        Kỹ thuật trồng lúa mới
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">Hôm qua</p>
                  </div>
                </div>
                <div className="flex items-center text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Bạn đã tham gia nhóm{" "}
                      <span className="font-medium">Nông dân miền Tây</span>
                    </p>
                    <p className="text-xs text-gray-500">2 ngày trước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-6 space-y-4">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <Tabs defaultValue="trangchu" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                  <TabsTrigger
                    value="trangchu"
                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Trang chủ
                  </TabsTrigger>
                  <TabsTrigger
                    value="ketnoicuatoi"
                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Kết nối của tôi
                  </TabsTrigger>
                  <TabsTrigger
                    value="phobien"
                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none"
                  >
                    Phổ biến
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trangchu" className="m-0 p-0">
                  {/* Bộ lọc bài viết */}
                  <div className="bg-white rounded-lg shadow mb-4 p-3 border-b">
                    <h3 className="font-medium text-sm mb-2">Lọc bài viết</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 bg-blue-50 text-blue-600"
                      >
                        Tất cả
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        Bài viết mới nhất
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        Nông nghiệp thông minh
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        Kỹ thuật trồng trọt
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        Chăn nuôi
                      </Badge>
                    </div>
                  </div>

                  {/* Create Post Box */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={auth?.user?.imageUrl || "/placeholder-user.jpg"}
                        />
                        <AvatarFallback>
                          {auth?.user?.username?.charAt(0) ||
                            auth?.user?.userName?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>

                      <Dialog
                        open={isCreatePostOpen}
                        onOpenChange={setIsCreatePostOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start font-normal text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full"
                          >
                            Bạn đang nghĩ gì?
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Tạo bài viết
                            </DialogTitle>
                          </DialogHeader>
                          <CreatePostForm onSubmit={handlePostSubmit} />
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex mt-3 pt-2 border-t">
                      <Button
                        variant="ghost"
                        className="flex-1 text-gray-600 gap-2 hover:bg-gray-100"
                        onClick={() => setIsCreatePostOpen(true)}
                      >
                        <Image size={18} className="text-blue-500" />
                        Ảnh/Video
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 text-gray-600 gap-2 hover:bg-gray-100"
                        onClick={() => setIsCreatePostOpen(true)}
                      >
                        <Calendar size={18} className="text-green-500" />
                        Sự kiện
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 text-gray-600 gap-2 hover:bg-gray-100"
                        onClick={() => setIsCreatePostOpen(true)}
                      >
                        <PenTool size={18} className="text-amber-500" />
                        Viết bài
                      </Button>
                    </div>
                  </div>

                  {/* Editing post dialog */}
                  {editingPost && (
                    <Dialog
                      open={!!editingPost}
                      onOpenChange={(open) => !open && setEditingPost(null)}
                    >
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Chỉnh sửa bài viết
                          </DialogTitle>
                        </DialogHeader>
                        <CreatePostForm
                          onSubmit={handlePostSubmit}
                          editMode={true}
                          initialPost={editingPost}
                          onCancel={() => setEditingPost(null)}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Post Feed */}
                  {isLoadingPosts ? (
                    <div className="bg-white p-8 text-center">
                      <div className="animate-pulse flex flex-col space-y-4">
                        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      </div>
                      <p className="text-gray-500 mt-4">Đang tải bài viết...</p>
                    </div>
                  ) : postsError ? (
                    <div className="bg-white p-8 text-center">
                      <p className="text-red-500">
                        Có lỗi xảy ra khi tải bài viết.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["forumPosts"],
                          })
                        }
                      >
                        Thử lại
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {console.log("Dữ liệu bài viết:", postsData)}
                      {postsData &&
                        postsData.content &&
                        Array.isArray(postsData.content) &&
                        postsData.content.map((post) => {
                          console.log("Bài viết gốc:", post);
                          console.log("Thông tin người dùng:", {
                            id: post.userId,
                            username: post.username,
                            userName: post.userName,
                            name: post.name,
                            user: post.user,
                          });

                          // Đảm bảo post có đủ thông tin người dùng
                          const enhancedPost = {
                            ...post,
                            // Cập nhật - Trong DB trường tên người dùng thực sự là "userName" không phải "username"
                            username:
                              post.userName ||
                              (post.user ? post.user.userName : null) ||
                              "",
                            // Thêm log để kiểm tra
                            _debug_originalData: {
                              id: post.id,
                              username: post.username, // Trường này có thể không tồn tại
                              userName: post.userName, // Trường này mới chính xác
                              name: post.name,
                              user: post.user,
                            },
                          };

                          console.log("Bài viết đã xử lý:", enhancedPost);

                          return (
                            <PostCard
                              key={post.id}
                              post={enhancedPost}
                              currentUser={auth?.user}
                              onReact={handleReaction}
                              onComment={handleComment}
                              onShare={handleShare}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          );
                        })}

                      {/* Fallback khi không có bài viết */}
                      {postsData &&
                        (!postsData.content ||
                          !Array.isArray(postsData.content) ||
                          postsData.content.length === 0) && (
                          <div className="bg-white p-8 text-center">
                            <p className="text-gray-500 mb-4">
                              Chưa có bài viết nào.
                            </p>
                            <Button
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setIsCreatePostOpen(true)}
                            >
                              Tạo bài viết đầu tiên
                            </Button>
                          </div>
                        )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ketnoicuatoi" className="p-4 text-center">
                  <p className="text-gray-500">
                    Xem bài viết từ những người bạn kết nối
                  </p>
                </TabsContent>

                <TabsContent value="phobien" className="p-4 text-center">
                  <p className="text-gray-500">
                    Đang hiển thị bài viết phổ biến nhất
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block md:col-span-3 space-y-4">
            {/* Gợi ý kết nối */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <Users size={18} className="mr-2 text-blue-600" />
                Có thể bạn biết
              </h3>

              <div className="space-y-4">
                {isLoadingUsers ? (
                  // Loading state
                  <div className="space-y-3">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 animate-pulse"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : // Render actual users
                Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
                  suggestedUsers
                    .filter((user) => user.id !== auth?.user?.id) // Exclude current user
                    .slice(0, 5) // Limit to 5 users
                    .map((user) => (
                      <div
                        key={user.id}
                        className="border-b pb-3 last:border-0 last:pb-0"
                      >
                        <UserConnectionItem
                          user={{
                            ...user,
                            role: user.role
                              ? getRoleLabel(user.role)
                              : "Người dùng",
                          }}
                          onConnect={handleConnect}
                        />
                        {user.mutualConnections > 0 && (
                          <p className="text-xs text-gray-500 mt-1 ml-12">
                            <span className="font-medium">
                              {user.mutualConnections}
                            </span>{" "}
                            kết nối chung
                          </p>
                        )}
                        {user.bio && (
                          <p className="text-xs text-gray-600 mt-1 ml-12 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                        {user.specialty && (
                          <Badge
                            variant="outline"
                            className="ml-12 mt-1 text-xs bg-blue-50 text-blue-600"
                          >
                            {user.specialty}
                          </Badge>
                        )}
                      </div>
                    ))
                ) : (
                  // Fallback when no users found
                  <div className="text-center text-sm text-gray-500 py-2">
                    Hiện chưa có gợi ý kết nối
                  </div>
                )}
              </div>

              {Array.isArray(suggestedUsers) && suggestedUsers.length > 5 && (
                <Button variant="link" className="w-full text-blue-600 mt-2">
                  Xem thêm
                </Button>
              )}
            </div>

            {/* Tin tức và sự kiện */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <Bell size={18} className="mr-2 text-amber-600" />
                Tin tức và sự kiện
              </h3>

              <div className="space-y-3">
                {latestNews.map((news) => (
                  <div
                    key={news.id}
                    className="hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <p className="font-medium text-sm">{news.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {news.date}
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="link" className="w-full text-blue-600 mt-2">
                Xem tất cả
              </Button>
            </div>

            {/* Cộng đồng */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3 text-gray-800">
                Cộng đồng nông nghiệp
              </h3>
              <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Kết nối với hơn 5,000 nông dân và chuyên gia nông nghiệp!
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Tham gia ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
