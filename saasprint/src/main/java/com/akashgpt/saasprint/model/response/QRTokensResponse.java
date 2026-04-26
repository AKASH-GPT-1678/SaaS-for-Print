package com.akashgpt.saasprint.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QRTokensResponse {
    private Integer userId;
    private String userName;
    private Integer qrTokens;
}
