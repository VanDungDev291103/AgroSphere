package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.ForumReplyDTO;
import com.agricultural.agricultural.entity.ForumPost;
import com.agricultural.agricultural.entity.ForumReply;
import com.agricultural.agricultural.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-19T14:39:23+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class ForumReplyMapperImpl implements ForumReplyMapper {

    @Override
    public ForumReplyDTO toDTO(ForumReply entity) {
        if ( entity == null ) {
            return null;
        }

        ForumReplyDTO.ForumReplyDTOBuilder forumReplyDTO = ForumReplyDTO.builder();

        forumReplyDTO.postId( entityPostId( entity ) );
        forumReplyDTO.userId( entityUserId( entity ) );
        forumReplyDTO.userName( entityUserUsername( entity ) );
        forumReplyDTO.userImageUrl( entityUserImageUrl( entity ) );
        forumReplyDTO.parentId( entityParentId( entity ) );
        forumReplyDTO.replies( mapReplies( entity.getReplies() ) );
        forumReplyDTO.id( entity.getId() );
        forumReplyDTO.content( entity.getContent() );
        forumReplyDTO.createdAt( entity.getCreatedAt() );
        forumReplyDTO.updatedAt( entity.getUpdatedAt() );
        forumReplyDTO.likeCount( entity.getLikeCount() );

        return forumReplyDTO.build();
    }

    private Integer entityPostId(ForumReply forumReply) {
        if ( forumReply == null ) {
            return null;
        }
        ForumPost post = forumReply.getPost();
        if ( post == null ) {
            return null;
        }
        int id = post.getId();
        return id;
    }

    private Integer entityUserId(ForumReply forumReply) {
        if ( forumReply == null ) {
            return null;
        }
        User user = forumReply.getUser();
        if ( user == null ) {
            return null;
        }
        int id = user.getId();
        return id;
    }

    private String entityUserUsername(ForumReply forumReply) {
        if ( forumReply == null ) {
            return null;
        }
        User user = forumReply.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    private String entityUserImageUrl(ForumReply forumReply) {
        if ( forumReply == null ) {
            return null;
        }
        User user = forumReply.getUser();
        if ( user == null ) {
            return null;
        }
        String imageUrl = user.getImageUrl();
        if ( imageUrl == null ) {
            return null;
        }
        return imageUrl;
    }

    private Integer entityParentId(ForumReply forumReply) {
        if ( forumReply == null ) {
            return null;
        }
        ForumReply parent = forumReply.getParent();
        if ( parent == null ) {
            return null;
        }
        Integer id = parent.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
