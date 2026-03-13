package com.kael.kaelaicodeproject;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy(exposeProxy = true)
@MapperScan("com.kael.kaelaicodeproject.mapper")
public class KaelAiCodeProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(KaelAiCodeProjectApplication.class, args);
    }

}
