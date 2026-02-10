package com.demo.ecommerce.product.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Redis cache auto-configured via spring.cache.type=redis in application.yml
    // @Cacheable / @CacheEvict annotations in ProductService handle the caching
}
