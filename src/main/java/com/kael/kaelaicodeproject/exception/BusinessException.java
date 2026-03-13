package com.kael.kaelaicodeproject.exception;

import lombok.Getter;

/**
 * ClassName：BusinessException
 * Description：
 *
 * @Author hoko
 * @Create 2026/3/10 16:36
 * @Version 1.0
 */
@Getter
public class BusinessException extends RuntimeException {

    /**
     * 错误码
     */
    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }
}

