package com.kael.kaelaicodeproject.controller;

import com.kael.kaelaicodeproject.common.BaseResponse;
import com.kael.kaelaicodeproject.common.ResultUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ClassName：TestController
 * Description：
 *
 * @Author hoko
 * @Create 2026/3/10 16:15
 * @Version 1.0
 */

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping("/")
    public BaseResponse<String> healthCheck() {
        return ResultUtils.success("ok");
    }
}

