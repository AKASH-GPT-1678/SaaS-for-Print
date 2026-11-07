package com.akashgpt.saasprint.service;

import java.awt.image.BufferedImage;
import java.util.UUID;


public interface QRService {
      BufferedImage generateQR(UUID qrId) throws Exception;

}
