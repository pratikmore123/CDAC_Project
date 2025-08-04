package com.cdac.moneymanager.dto;

import com.cdac.moneymanager.entity.ProfileEntity;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CategoryDTO {
    private Long id;
    private Long profileId;
    private String name;
    private String icon;
    private String type;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
