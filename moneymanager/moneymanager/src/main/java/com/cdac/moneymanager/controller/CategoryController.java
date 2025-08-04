package com.cdac.moneymanager.controller;

import com.cdac.moneymanager.dto.CategoryDTO;
import com.cdac.moneymanager.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> saveCatgory(@RequestBody CategoryDTO categoryDTO)
    {
       CategoryDTO savedCategory= categoryService.saveCategory(categoryDTO);
       return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories()
    {
        return ResponseEntity.ok(categoryService.getCategoriesForCurrentUser());
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByTypeForCurrentUser(@PathVariable String type)
    {
        return ResponseEntity.ok(categoryService.getCategoriesByTypeForCurrentUser(type));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable  Long categoryId,@RequestBody CategoryDTO categoryDTO)
    {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId,categoryDTO));
    }

}
