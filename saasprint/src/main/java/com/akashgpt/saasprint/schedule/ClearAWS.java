package com.akashgpt.saasprint.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ClearAWS {

    @Scheduled(fixedRate = 5000)
	public void reportCurrentTime() {
		// log.info("The time is now {}", dateFormat.format(new Date()));
        
	}

}
