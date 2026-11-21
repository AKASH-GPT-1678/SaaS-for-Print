# Printar API

The backend is a Java 21 and Spring Boot 4 API. Its interactive OpenAPI documentation is provided by
springdoc-openapi and is disabled by default so it is not exposed accidentally in a deployed environment.

## Enable Swagger UI

Configure the backend as described in `src/main/resources/application.properties.example`, then enable
the documentation for the current process.

PowerShell:

```powershell
$env:SWAGGER_ENABLED = "true"
.\mvnw.cmd spring-boot:run
```

macOS or Linux:

```bash
SWAGGER_ENABLED=true ./mvnw spring-boot:run
```

When the API is running on its default port, open:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- OpenAPI YAML: `http://localhost:8080/v3/api-docs.yaml`

The application must still have its normal database, JWT, and AWS configuration to start. Opening the
documentation does not call AWS or Razorpay, but trying document-upload or paid-QR operations requires
their corresponding services.

## Call protected endpoints

1. Run `POST /auth/login` in Swagger UI.
2. Copy the `token` value from the response.
3. Select **Authorize** and paste the token. Do not add a `Bearer ` prefix; Swagger UI adds it.
4. The protected `/qr/**` operations can now be exercised for that account.

Do not commit access tokens, customer documents, database passwords, AWS credentials, or Razorpay keys.

## Verify

Run the backend tests from this directory:

```powershell
.\mvnw.cmd test
```

After starting the configured application with Swagger enabled, confirm that `/v3/api-docs` returns
an OpenAPI document and that Swagger UI groups the Authentication, Document Delivery, and QR Codes APIs.
