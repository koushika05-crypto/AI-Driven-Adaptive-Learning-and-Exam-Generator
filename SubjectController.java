package com.example.SkillForge.controller;

import com.example.SkillForge.dto.LoginRequest;
import com.example.SkillForge.dto.LoginResponse;
import com.example.SkillForge.dto.RegisterRequest;
import com.example.SkillForge.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER API
    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody RegisterRequest request) {
        return authService.registerUser(request);
    }

    // LOGIN API
    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest request){
        return authService.loginUser(request);
    }
}