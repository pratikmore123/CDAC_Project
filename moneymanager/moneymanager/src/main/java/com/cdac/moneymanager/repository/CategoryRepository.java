package com.cdac.moneymanager.repository;

import com.cdac.moneymanager.entity.CategoryEntity;
import com.cdac.moneymanager.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {

    List<CategoryEntity> findByProfileId(Long profileId);
    Optional<CategoryEntity> findByIdAndProfileId(Long id,Long profileId);
    List<CategoryEntity> findByTypeAndProfileId(String type,Long profileId );
    boolean existsByNameAndProfileId(String name,Long profileId);
}
