package com.kael.kaelaicodeproject.ai;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeGeneratorServiceFactory {

    @Resource
    private ChatModel chatModel;

    // 核心工厂方法：生产 AiCodeGeneratorService 实例
    @Bean
    public AiCodeGeneratorService aiCodeGeneratorService() {
        // 封装创建逻辑：调用 LangChain4j 的工具类生成接口实例
        // （接口不能直接new，框架会动态生成实现类）
        return AiServices.create(AiCodeGeneratorService.class, chatModel);
    }
}
