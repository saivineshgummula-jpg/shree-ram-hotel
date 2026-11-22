package org.ramya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication does THREE things in one annotation:
// 1. @Configuration       — this class can define Spring beans (components)
// 2. @EnableAutoConfiguration — Spring Boot auto-configures everything it finds
//    (e.g., sees spring-web on classpath → starts Tomcat server automatically)
// 3. @ComponentScan       — scans this package for controllers, services, etc.
@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        // This boots up the entire embedded Tomcat server and your app
        // You will be able to open http://localhost:8080 in your browser!
        SpringApplication.run(Main.class, args);
    }
}
