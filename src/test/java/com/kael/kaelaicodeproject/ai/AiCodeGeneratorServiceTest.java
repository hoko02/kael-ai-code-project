package com.kael.kaelaicodeproject.ai;

import com.kael.kaelaicodeproject.ai.model.HtmlCodeResult;
import com.kael.kaelaicodeproject.ai.model.MultiFileCodeResult;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AiCodeGeneratorServiceTest {


    @Resource
    private AiCodeGeneratorService aiCodeGeneratorService;

    //@Disabled("临时禁用，避免消耗DeepSeek token")
    @Test
    void generateHtmlCode() {
        HtmlCodeResult result = aiCodeGeneratorService.generateHtmlCode("做个kael的工作记录小工具，不超过20行");
        Assertions.assertNotNull(result);
    }

    @Disabled("临时禁用，避免消耗DeepSeek token")
    @Test
    void generateMultiFileCode() {
        //MultiFileCodeResult multiFileCode = aiCodeGeneratorService.generateMultiFileCode("做个kael的留言板");
        //Assertions.assertNotNull(multiFileCode);
    }
}
