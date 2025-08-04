package com.cdac.moneymanager.service;


import com.cdac.moneymanager.dto.ExpenseDTO;
import com.cdac.moneymanager.entity.CategoryEntity;
import com.cdac.moneymanager.entity.ExpenseEntity;
import com.cdac.moneymanager.entity.ProfileEntity;
import com.cdac.moneymanager.repository.CategoryRepository;
import com.cdac.moneymanager.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;

    public ExpenseDTO addExpense(ExpenseDTO expenseDTO)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        CategoryEntity category=categoryRepository.findById(expenseDTO.getCategoryId()).orElseThrow(()->new RuntimeException("Category Not Found"));
       ExpenseEntity newExpense= toEntity(expenseDTO,profile,category);
       newExpense=expenseRepository.save(newExpense);
       return toDto(newExpense);
    }

    //Retrive expenses for current month
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        LocalDate now =LocalDate.now();
        LocalDate startDate=now.withDayOfMonth(1);
        LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> list=expenseRepository.findByProfileIdAndDateBetween(profile.getId(),startDate,endDate);
        return list.stream().map(this::toDto).toList();
    }

    //delete exp by id for current user
    public void deleteExpense(Long expenseId)
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        ExpenseEntity entity=expenseRepository.findById(expenseId)
                .orElseThrow(()->new RuntimeException("Expense Not found"));
        if(!entity.getProfile().getId().equals(profile.getId()))
        {
            throw new RuntimeException("Unathorized to delete this expense");
        }
        expenseRepository.delete(entity);

    }
    //get latest 5 expenses for current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        List<ExpenseEntity> list=expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDto).toList();
    }

    //get total expense
    public BigDecimal getTotalExpenseForCurrentUser()
    {
        ProfileEntity profile=profileService.getCurrentProfile();
        BigDecimal total=expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total != null ? total: BigDecimal.ZERO;
    }


    public ExpenseEntity toEntity(ExpenseDTO expenseDTO, ProfileEntity profile, CategoryEntity category)
    {
        return ExpenseEntity.builder().
                name(expenseDTO.getName())
                .icon(expenseDTO.getIcon())
                .amount(expenseDTO.getAmount())
                .date(expenseDTO.getDate())
                .profile(profile)
                .category(category)
                .build();
    }
    public ExpenseDTO toDto(ExpenseEntity expenseEntity)
    {
        return ExpenseDTO.builder()
                .id(expenseEntity.getId())
                .name(expenseEntity.getName())
                .icon(expenseEntity.getIcon())
                .amount(expenseEntity.getAmount())
                .date(expenseEntity.getDate())
                .categoryId(expenseEntity.getCategory()!=null ? expenseEntity.getCategory().getId():null)
                .categoryName(expenseEntity.getCategory()!=null ? expenseEntity.getCategory().getName():null)
                .amount(expenseEntity.getAmount())
                .date(expenseEntity.getDate())
                .createdAt(expenseEntity.getCreatedAt())
                .updatedAt((expenseEntity.getUpdatedAt()))
                .build();
    }
}
