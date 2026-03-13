package com.kael.kaelaicodeproject.common;

import lombok.Data;

import java.io.Serializable;

/**
 * ClassName：DeleteRequest
 * Description：
 *
 * @Author hoko
 * @Create 2026/3/10 16:39
 * @Version 1.0
 */
@Data
public class DeleteRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    private static final long serialVersionUID = 1L;
}

