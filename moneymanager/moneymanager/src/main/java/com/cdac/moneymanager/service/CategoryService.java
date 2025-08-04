package com.cdac.moneymanager.service;

import com.cdac.moneymanager.dto.CategoryDTO;
import com.cdac.moneymanager.entity.CategoryEntity;
import com.cdac.moneymanager.entity.ProfileEntity;
import com.cdac.moneymanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

     //save catgory
    public CategoryDTO saveCategory(CategoryDTO categoryDTO)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndProfileId(categoryDTO.getName(),profile.getId()))
        {
            throw new RuntimeException("Category with this name alreday exist");
        }
        CategoryEntity newCtegoryEntity=toEntity(categoryDTO,profile);
        categoryRepository.save(newCtegoryEntity);
        return toDto(newCtegoryEntity);
    }

    public List<CategoryDTO> getCategoriesForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        List<CategoryEntity> categories=categoryRepository.findByProfileId(profile.getId());
        return categories.stream().map(this::toDto).toList();
    }

    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        List<CategoryEntity> categories=categoryRepository.findByTypeAndProfileId(type,profile.getId());
        return categories.stream().map(this::toDto).toList();
    }

    public CategoryDTO updateCategory(Long categoryId,CategoryDTO categoryDTO)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        CategoryEntity existingCategory=categoryRepository.findByIdAndProfileId(categoryId,profile.getId()).
                orElseThrow(()->new RuntimeException("Category not found or not Accessible"));
        existingCategory.setIcon(categoryDTO.getIcon());
        existingCategory.setName(categoryDTO.getName());
        existingCategory=categoryRepository.save(existingCategory);
        return toDto(existingCategory);

    }

    //helper methods
    private CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile)
    {
        return CategoryEntity.builder()
                .name(categoryDTO.getName())
                .icon(categoryDTO.getIcon())
                .profile(profile)
                .type(categoryDTO.getType())
                .build();
    }

    private CategoryDTO toDto(CategoryEntity categoryEntity)
    {
        return CategoryDTO.builder()
                .id(categoryEntity.getId())
                .name(categoryEntity.getName())
                .icon(categoryEntity.getIcon())
                .profileId(categoryEntity.getProfile() != null ? categoryEntity.getProfile().getId():null)
                .type(categoryEntity.getType())
                .createdAt(categoryEntity.getCreatedAt())
                .updatedAt(categoryEntity.getUpdatedAt())
                .build();
    }
}
