package com.agricultural.agricultural.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import com.agricultural.agricultural.dto.ForumPostDTO;
import com.agricultural.agricultural.entity.ForumPost;

@Mapper(uses = {ForumPostImageMapper.class})
public interface ForumPostMapper {

    // Tạo một instance của ForumPostMapper
    ForumPostMapper INSTANCE = Mappers.getMapper(ForumPostMapper.class);

    // Chuyển từ ForumPost (Entity) sang ForumPostDTO
    @Mapping(source = "user.id", target = "userId") // Ánh xạ userId từ user.id
    @Mapping(source = "user.username", target = "userName") // Ánh xạ userName từ user.username
    @Mapping(source = "user.imageUrl", target = "userAvatar") // Ánh xạ userAvatar từ user.imageUrl
    @Mapping(source = "images", target = "images") // Ánh xạ danh sách ảnh
    ForumPostDTO toDTO(ForumPost forumPost);

    // Chuyển từ ForumPostDTO sang ForumPost (Entity)
    @Mapping(target = "user", ignore = true) // Bỏ qua ánh xạ user, để service xử lý
    @Mapping(target = "images", ignore = true) // Bỏ qua ánh xạ images, để service xử lý
    ForumPost toEntity(ForumPostDTO forumPostDTO);
}
