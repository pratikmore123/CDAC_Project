package com.cdac.moneymanager.service;

import com.cdac.moneymanager.dto.ExpenseDTO;
import com.cdac.moneymanager.dto.IncomeDTO;
import com.cdac.moneymanager.entity.CategoryEntity;

import com.cdac.moneymanager.entity.ExpenseEntity;
import com.cdac.moneymanager.entity.IncomeEntity;
import com.cdac.moneymanager.entity.ProfileEntity;

import com.cdac.moneymanager.repository.CategoryRepository;
import com.cdac.moneymanager.repository.IncomeRepository;
import com.cdac.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final CategoryService categoryService;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public IncomeDTO addIncome(IncomeDTO incomeDTO)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        CategoryEntity category=categoryRepository.findById(incomeDTO.getCategoryId()).orElseThrow(()->new RuntimeException("Category Not Found"));
        IncomeEntity newIncome= toEntity(incomeDTO,profile,category);
        newIncome=incomeRepository.save(newIncome);
        return toDto(newIncome);

    }
    public List<IncomeDTO> getCurrentMonthIncomeForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        LocalDate now =LocalDate.now();
        LocalDate startDate=now.withDayOfMonth(1);
        LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list=incomeRepository.findByProfileIdAndDateBetween(profile.getId(),startDate,endDate);
        return list.stream().map(this::toDto).toList();
    }
    //delete income by id for current user
    public void deleteIncome(Long incomeId)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        IncomeEntity entity=incomeRepository.findById(incomeId)
                .orElseThrow(()->new RuntimeException("Income Not found"));
        if(!entity.getProfile().getId().equals(profile.getId()))
        {
            throw new RuntimeException("Unathorized to delete this income");
        }
        incomeRepository.delete(entity);
    }

    public List<IncomeDTO> getLatest5IncomesForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        List<IncomeEntity> list=incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDto).toList();
    }


    public BigDecimal getTotalIncomesForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        BigDecimal total=incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total: BigDecimal.ZERO;
    }


    public IncomeEntity toEntity(IncomeDTO incomeDTO, ProfileEntity profile, CategoryEntity category)
    {
        return IncomeEntity.builder().
                name(incomeDTO.getName())
                .icon(incomeDTO.getIcon())
                .amount(incomeDTO.getAmount())
                .date(incomeDTO.getDate())
                .profile(profile)
                .category(category)
                .build();
    }
    public IncomeDTO toDto(IncomeEntity incomeEntity)
    {
        return IncomeDTO.builder()
                .id(incomeEntity.getId())
                .name(incomeEntity.getName())
                .icon(incomeEntity.getIcon())
                .amount(incomeEntity.getAmount())
                .date(incomeEntity.getDate())
                .categoryId(incomeEntity.getCategory()!=null ? incomeEntity.getCategory().getId():null)
                .categoryName(incomeEntity.getCategory()!=null ? incomeEntity.getCategory().getName():null)
                .amount(incomeEntity.getAmount())
                .date(incomeEntity.getDate())
                .createdAt(incomeEntity.getCreatedAt())
                .updatedAt((incomeEntity.getUpdatedAt()))
                .build();
    }
}
