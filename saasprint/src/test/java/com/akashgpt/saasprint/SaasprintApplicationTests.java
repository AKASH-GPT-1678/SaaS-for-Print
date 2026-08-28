package com.akashgpt.saasprint;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requires local Postgres, JWT secret, and AWS credentials")
class SaasprintApplicationTests {

	@Test
	void contextLoads() {
	}

}
