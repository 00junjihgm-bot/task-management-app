package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // /api/** や拡張子付きファイル（.js, .css 等）以外のすべてのリクエストを index.html へ転送
    @GetMapping(value = "/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
