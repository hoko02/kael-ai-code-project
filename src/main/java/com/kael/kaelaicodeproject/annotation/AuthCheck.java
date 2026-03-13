package com.kael.kaelaicodeproject.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 用户权限控制
 * 权限校验其实是一个比较通用的业务需求
 * 一般通过 SpringAOP 切面 + 自定义权限校验注解实现统一的接口拦截和权限校验
 * 如果有特殊的权限校验逻辑，再单独在接口中编码
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthCheck {

    /**
     * 必须有某个角色
     */
    String mustRole() default "";
}
